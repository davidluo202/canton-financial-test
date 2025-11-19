"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, X, Send, Loader2, Languages } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<'auto' | 'zh' | 'en'>('auto');
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 快捷问题建议
  const quickQuestions = [
    {
      zh: "你們的服務範圍是什麼？",
      en: "What services do you offer?"
    },
    {
      zh: "如何聯繫你們？",
      en: "How can I contact you?"
    },
    {
      zh: "你們有哪些牌照資質？",
      en: "What licenses do you hold?"
    },
    {
      zh: "辦公地址在哪裡？",
      en: "Where is your office located?"
    }
  ];

  // 使用tRPC mutation
  const chatMutation = trpc.chatbot.chat.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 打开Chatbot时自动检测页面语言并设置偏好语言
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // 自动设置为页面语言
      setPreferredLanguage(language);
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          language === "zh"
            ? "您好！我是誠港金融的AI助手。我可以幮助您了解我們的服務、投資相關問題，或查詢香港證監會（SFC）、香港證券及投資學會（HKSI）等權威機構的資訊。請問有什麼可以幫到您？"
            : "Hello! I'm Canton Mutual Financial's AI assistant. I can help you learn about our services, investment-related questions, or search information from authoritative sources like SFC and HKSI. How may I assist you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const result = await chatMutation.mutateAsync({
        message: userMessage.content,
        language: language,
        preferredLanguage: preferredLanguage,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // 更新后续问题
      if (result.followUpQuestions && result.followUpQuestions.length > 0) {
        setFollowUpQuestions(result.followUpQuestions);
      } else {
        setFollowUpQuestions([]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      const displayLang = preferredLanguage === 'auto' ? language : preferredLanguage;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          displayLang === "zh"
            ? "抱歉，我遇到了一些技術問題。請稍後再試，或直接聯繫我們的客戶服務團隊：customer-services@cmfinancial.com"
            : "Sorry, I encountered a technical issue. Please try again later or contact our customer service team directly: customer-services@cmfinancial.com",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label={language === "zh" ? "打開聊天" : "Open Chat"}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* 头部 */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">
                {language === "zh" ? "誠港金融 AI 助手" : "CMF AI Assistant"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {/* 语言切换按钮 */}
              <div className="flex items-center gap-1 bg-blue-700 rounded-full p-1">
                <button
                  onClick={() => setPreferredLanguage('zh')}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    preferredLanguage === 'zh'
                      ? 'bg-white text-blue-600'
                      : 'hover:bg-blue-600 text-white'
                  }`}
                  title="繁體中文"
                >
                  中
                </button>
                <button
                  onClick={() => setPreferredLanguage('en')}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    preferredLanguage === 'en'
                      ? 'bg-white text-blue-600'
                      : 'hover:bg-blue-600 text-white'
                  }`}
                  title="English"
                >
                  EN
                </button>
                <button
                  onClick={() => setPreferredLanguage('auto')}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                    preferredLanguage === 'auto'
                      ? 'bg-white text-blue-600'
                      : 'hover:bg-blue-600 text-white'
                  }`}
                  title="自动检测 / Auto Detect"
                >
                  <Languages className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 rounded-full p-1 transition-colors"
                aria-label={language === "zh" ? "關閉" : "Close"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString(
                      language === "zh" ? "zh-HK" : "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            
            {/* 快捷问题建议 - 显示初始问题或动态后续问题 */}
            {(messages.length === 1 && messages[0].role === "assistant") || (followUpQuestions.length > 0 && messages.length > 1 && messages[messages.length - 1].role === "assistant") ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  {preferredLanguage === 'en' || (preferredLanguage === 'auto' && language === 'en')
                    ? (messages.length === 1 ? "Quick questions:" : "You might also want to ask:")
                    : (messages.length === 1 ? "常見問題：" : "您可能還想問：")}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(followUpQuestions.length > 0 && messages.length > 1 ? followUpQuestions : quickQuestions.map(q => {
                    const displayLang = preferredLanguage === 'auto' ? language : preferredLanguage;
                    return displayLang === 'zh' ? q.zh : q.en;
                  })).map((questionText, index) => {
                    return (
                      <button
                        key={index}
                        onClick={async () => {
                          if (chatMutation.isPending) return;
                          
                          // 清除后续问题
                          setFollowUpQuestions([]);
                          
                          // 创建用户消息
                          const userMessage: Message = {
                            id: Date.now().toString(),
                            role: "user",
                            content: questionText,
                            timestamp: new Date(),
                          };

                          setMessages((prev) => [...prev, userMessage]);

                          try {
                            const result = await chatMutation.mutateAsync({
                              message: questionText,
                              language: language,
                              preferredLanguage: preferredLanguage,
                              conversationHistory: messages.map(m => ({
                                role: m.role,
                                content: m.content,
                              })),
                            });

                            const assistantMessage: Message = {
                              id: (Date.now() + 1).toString(),
                              role: "assistant",
                              content: result.response,
                              timestamp: new Date(),
                            };

                            setMessages((prev) => [...prev, assistantMessage]);
                            
                            // 更新后续问题
                            if (result.followUpQuestions && result.followUpQuestions.length > 0) {
                              setFollowUpQuestions(result.followUpQuestions);
                            }
                          } catch (error) {
                            console.error("Chatbot error:", error);
                            const displayLang = preferredLanguage === 'auto' ? language : preferredLanguage;
                            const errorMessage: Message = {
                              id: (Date.now() + 1).toString(),
                              role: "assistant",
                              content:
                                displayLang === "zh"
                                  ? "抱歉，我遇到了一些技術問題。請稍後再試，或直接聯繫我們的客戶服務團隊：customer-services@cmfinancial.com"
                                  : "Sorry, I encountered a technical issue. Please try again later or contact our customer service team directly: customer-services@cmfinancial.com",
                              timestamp: new Date(),
                            };
                            setMessages((prev) => [...prev, errorMessage]);
                          }
                        }}
                        disabled={chatMutation.isPending}
                        className="bg-white hover:bg-blue-50 text-gray-700 text-sm p-3 rounded-lg border border-gray-200 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {questionText}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "zh"
                    ? "輸入您的問題..."
                    : "Type your question..."
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                disabled={chatMutation.isPending}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
                aria-label={language === "zh" ? "發送" : "Send"}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {language === "zh"
                ? "由 AI 提供支援 · 僅供參考"
                : "Powered by AI · For reference only"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
