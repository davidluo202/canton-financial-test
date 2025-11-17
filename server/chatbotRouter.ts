import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { saveChatLog, getChatLogsForToday } from "./db";

// 网站内容知识库
const WEBSITE_KNOWLEDGE = `
Canton Mutual Financial Limited (誠港金融股份有限公司) is a boutique investment bank registered in Hong Kong.

Company Information:
- Licensed by Securities and Futures Commission (SFC) of Hong Kong
- Central Number: BSU667
- Licenses: Type 1 (Dealing in Securities), Type 4 (Advising on Securities), Type 9 (Asset Management)

Services:
1. Investment Banking Services:
   - Liability Management & Restructuring
   - Global Market Investment Advisory
   - Capital Market Solutions

2. FICC and Equity:
   - Elite Brokerage Coverage
   - Cash Equities & Execution Solutions
   - Derivatives
   - Global Credit
   - Interest Rate Products
   - Mortgage & Structured Products
   - Repo

3. Asset and Wealth Management:
   - Comprehensive asset and wealth management services

Core Values:
- Profession (專精立業): Professional excellence
- Potential (潛能傲世): Unlocking potential
- Partnership (同道致遠): Long-term partnerships

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

Disclaimer:
Investment involves risks. The value of securities, futures, or other assets may rise and fall, and investors may lose all their invested capital. The information provided is for general information only and does not constitute investment advice.
`;

export const chatbotRouter = router({
  // 处理聊天消息
  chat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        language: z.enum(["zh", "en"]),
        conversationHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, language, conversationHistory = [] } = input;

      try {
        // 智能检测用户问题的语言
        const detectLanguage = (text: string): 'zh' | 'en' => {
          // 检测是否包含中文字符（简体或繁体）
          const hasChinese = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
          return hasChinese ? 'zh' : 'en';
        };

        const detectedLanguage = detectLanguage(message);

        // 构建系统提示词
        const systemPrompt = detectedLanguage === "zh"
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
          detectedLanguage === "zh"
            ? "抱歉，我遇到了一些技術問題。請稍後再試，或直接聯繫我們的客戶服務團隊：customer-services@cmfinancial.com"
            : "Sorry, I encountered a technical issue. Please try again later or contact our customer service team directly: customer-services@cmfinancial.com"
        );

        // 保存对话记录
        await saveChatLog({
          userMessage: message,
          assistantMessage,
          language: detectedLanguage,
        });

        return {
          response: assistantMessage,
        };
      } catch (error) {
        console.error("Chatbot error:", error);
        
        const fallbackMessage = detectedLanguage === "zh"
          ? "這個問題我目前無法解答，我還需要努力學習，請給我一些時間哦"
          : "I cannot answer this question right now. I need to study harder, so please give me some time!";

        return {
          response: fallbackMessage,
        };
      }
    }),

  // 获取今日对话记录（用于邮件发送）
  getTodayLogs: publicProcedure.query(async () => {
    return await getChatLogsForToday();
  }),
});
