import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { saveChatLog, getChatLogsForToday, saveChatRating, getRatingForChatLog } from "./db";

// 网站知识库
const WEBSITE_KNOWLEDGE = `
Company Name: Canton Mutual Financial Limited (誠港金融股份有限公司)

SFC License Information:
Canton Mutual Financial Limited is licensed by the Securities and Futures Commission of Hong Kong (SFC).
- Central Number: BSU667
- Licensed Types: Type 1 (Dealing in Securities), Type 4 (Advising on Securities), Type 9 (Asset Management)

Core Values:
- Profession (專精立業): Professional excellence and expertise
- Potential (潛能傲世): Unlocking potential and maximizing capabilities  
- Partnership (同道致遠): Building lasting partnerships for mutual success

Services:
1. Investment Banking Services
   - Debt Management & Restructuring
   - Global Market Investment Advisory
   - Capital Market Solutions

2. FICC and Equity
   - Elite Brokerage Coverage
   - Cash Equities & Execution Solutions
   - Derivatives
   - Global Credit
   - Interest Rate Products
   - Mortgage & Structured Products
   - Repo

3. Asset and Wealth Management

Leadership:
- Jack Mou (牟致雪): Founder and Chairman
- Xintao Luo (羅新濤): CEO

Contact:
- Address (中文): 香港上環德輔道中308號2304-05室
- Address (English): Units 2304-5, 23/F, 308 Central Des Voeux, No. 308 Des Voeux Road Central, Hong Kong
- Phone: +852 2598 1700
- Fax: +852 2561 7028
- Email: info@cmfinancial.com
- HR Email: HR@cmfinancial.com
- Customer Service: customer-services@cmfinancial.com
- Website: www.cmfinancial.com
- Business Hours: Monday to Friday, 9:00 AM - 6:00 PM (Hong Kong Time)

Regulatory Information:
Canton Mutual Financial Limited provides services and is regulated as a licensed corporation recognized by the Securities and Futures Commission of Hong Kong (Central No.: BSU667).
`;

export const chatbotRouter = router({
  // Submit rating for a chat conversation
  submitRating: publicProcedure
    .input(z.object({
      chatLogId: z.number(),
      rating: z.enum(["positive", "negative"]),
    }))
    .mutation(async ({ input }) => {
      try {
        // Check if rating already exists
        const existingRating = await getRatingForChatLog(input.chatLogId);
        if (existingRating) {
          return {
            success: false,
            message: "Rating already submitted for this conversation",
          };
        }

        // Save the rating
        await saveChatRating({
          chatLogId: input.chatLogId,
          rating: input.rating,
        });

        return {
          success: true,
          message: "Thank you for your feedback!",
        };
      } catch (error) {
        console.error("[Chatbot] Error submitting rating:", error);
        return {
          success: false,
          message: "Failed to submit rating",
        };
      }
    }),

  // 处理聊天消息
  chat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        language: z.enum(["zh", "en"]),
        preferredLanguage: z.enum(["auto", "zh", "en"]).optional(),
        conversationHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, language, preferredLanguage = "auto", conversationHistory = [] } = input;

      try {
        // 智能检测用户问题的语言
        const detectLanguage = (text: string): 'zh' | 'en' => {
          // 检测是否包含中文字符（简体或繁体）
          const hasChinese = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
          return hasChinese ? 'zh' : 'en';
        };

        // 确定回复语言：如果用户手动选择了语言，使用选择的语言；否则自动检测
        const responseLanguage = preferredLanguage === "auto" 
          ? detectLanguage(message) 
          : preferredLanguage;

        // 构建系统提示词
        const systemPrompt = responseLanguage === "zh"
          ? `你是誠港金融股份有限公司（Canton Mutual Financial Limited）的AI客服助手。你的任務是：

1. 回答有關公司服務、業務和聯繫方式的問題
2. 提供投資相關的基本資訊
3. 如需要，可以參考香港證監會（SFC）、香港證券及投資學會（HKSI）等權威機構的公開資訊

以下是公司的基本資訊：
${WEBSITE_KNOWLEDGE}

重要規則：
- **必須使用繁體中文回答**（即使用戶使用簡體中文提問）
- 保持專業、友好的語氣
- 如果問題超出你的知識範圍，請誠實告知並建議聯繫客戶服務團隊
- 不要提供具體的投資建議，只提供一般性資訊
- 對於監管相關問題，建議查閱SFC官方網站 (www.sfc.hk)
- 如果無法回答，請說："這個問題我目前無法解答，我還需要努力學習，請給我一些時間哦"`
          : `You are an AI customer service assistant for Canton Mutual Financial Limited. Your tasks are:

1. Answer questions about company services, business, and contact information
2. Provide basic investment-related information
3. When needed, refer to public information from authoritative sources like SFC and HKSI

Here is the company's basic information:
${WEBSITE_KNOWLEDGE}

Important rules:
- Maintain a professional and friendly tone
- If a question is beyond your knowledge, be honest and suggest contacting the customer service team
- Do not provide specific investment advice, only general information
- For regulatory questions, suggest checking the official SFC website (www.sfc.hk)
- If you cannot answer, say: "I cannot answer this question right now. I need to study harder, so please give me some time!"`;

        // 构建消息历史
        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...conversationHistory.slice(-10).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
          { role: "user" as const, content: message },
        ];

        // 调用LLM
        const response = await invokeLLM({
          messages,
        });

        const assistantMessage = response.choices[0]?.message?.content || (
          responseLanguage === "zh"
            ? "抱歉，我遇到了一些技術問題。請稍後再試，或直接聯繫我們的客戶服務團隊：customer-services@cmfinancial.com"
            : "Sorry, I encountered a technical issue. Please try again later or contact our customer service team directly: customer-services@cmfinancial.com"
        );

        // 保存对话记录并获取ID
        const chatLogResult = await saveChatLog({
          userMessage: message,
          assistantMessage,
          language: responseLanguage,
        });
        
        // 获取刚插入的记录ID
        const chatLogId = chatLogResult?.[0]?.insertId || null;

        // 生成上下文相关的后续问题
        const followUpQuestionsPrompt = responseLanguage === "zh"
          ? `基于上下文对话，生成3个用户可能感兴趣的后续问题。这些问题应该：
1. 与当前话题相关
2. 帮助用户深入了解
3. 简洁明了，每个不超过20个字

请只返回3个问题，每行一个，不要编号或其他格式。`
          : `Based on the conversation context, generate 3 follow-up questions that users might be interested in. These questions should:
1. Be related to the current topic
2. Help users learn more
3. Be concise, no more than 15 words each

Return only 3 questions, one per line, without numbering or other formatting.`;

        let followUpQuestions: string[] = [];
        try {
          const followUpResponse = await invokeLLM({
            messages: [
              { role: "system" as const, content: systemPrompt },
              ...conversationHistory.slice(-5).map(msg => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
              })),
              { role: "user" as const, content: message },
              { role: "assistant" as const, content: assistantMessage },
              { role: "user" as const, content: followUpQuestionsPrompt },
            ],
          });

          const questionsText = followUpResponse.choices[0]?.message?.content || "";
          followUpQuestions = questionsText
            .split("\n")
            .map(q => q.trim())
            .filter(q => q.length > 0 && q.length < 100)
            .slice(0, 3);
        } catch (error) {
          console.error("Failed to generate follow-up questions:", error);
        }

        return {
          response: assistantMessage,
          followUpQuestions,
          chatLogId,
        };
      } catch (error) {
        console.error("Chatbot error:", error);
        
        const responseLanguage = preferredLanguage === "auto" 
          ? (language === "zh" ? "zh" : "en")
          : preferredLanguage;
        
        const fallbackMessage = responseLanguage === "zh"
          ? "這個問題我目前無法解答，我還需要努力學習，請給我一些時間哦"
          : "I cannot answer this question right now. I need to study harder, so please give me some time!";

        return {
          response: fallbackMessage,
        };
      }
    }),
});
