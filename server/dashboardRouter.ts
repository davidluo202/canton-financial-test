import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { 
  getChatLogsForToday, 
  getChatLogsForDateRange,
  getChatRatingsForToday,
  getChatRatingsForDateRange 
} from "./db";

/**
 * Dashboard Router
 * 提供AI Chatbot管理后台的统计数据API
 */
export const dashboardRouter = router({
  /**
   * 获取实时统计概览
   */
  getOverviewStats: publicProcedure.query(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 获取今日对话记录
    const todayLogs = await getChatLogsForToday();
    
    // 获取今日评分
    const todayRatings = await getChatRatingsForToday();
    
    // 计算统计数据
    const totalConversations = todayLogs.length;
    const uniqueUsers = Math.ceil(totalConversations / 3); // 简化估算
    
    const positiveRatings = todayRatings.filter(r => r.rating === "positive").length;
    const negativeRatings = todayRatings.filter(r => r.rating === "negative").length;
    const totalRatings = todayRatings.length;
    const satisfactionRate = totalRatings > 0 
      ? Math.round((positiveRatings / totalRatings) * 100) 
      : 0;

    // 计算语言分布
    const chineseConversations = todayLogs.filter(log => log.language === 'zh').length;
    const englishConversations = todayLogs.filter(log => log.language === 'en').length;

    return {
      totalConversations,
      uniqueUsers,
      satisfactionRate,
      positiveRatings,
      negativeRatings,
      totalRatings,
      chineseConversations,
      englishConversations,
      lastUpdated: new Date().toISOString(),
    };
  }),

  /**
   * 获取满意度趋势数据
   */
  getSatisfactionTrend: publicProcedure
    .input(z.object({
      days: z.number().min(1).max(90).default(7),
    }))
    .query(async ({ input }) => {
      const { days } = input;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // 获取日期范围内的对话和评分
      const logs = await getChatLogsForDateRange(startDate, endDate);
      const ratings = await getChatRatingsForDateRange(startDate, endDate);

      // 按日期分组统计
      const trendData: Array<{
        date: string;
        conversations: number;
        satisfactionRate: number;
        positiveRatings: number;
        negativeRatings: number;
      }> = [];

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        // 筛选当天的数据
        const dayLogs = logs.filter(log => {
          const logDate = new Date(log.createdAt).toISOString().split('T')[0];
          return logDate === dateStr;
        });

        const dayRatings = ratings.filter(rating => {
          const ratingDate = new Date(rating.createdAt).toISOString().split('T')[0];
          return ratingDate === dateStr;
        });

        const positive = dayRatings.filter(r => r.rating === "positive").length;
        const negative = dayRatings.filter(r => r.rating === "negative").length;
        const total = dayRatings.length;
        const rate = total > 0 ? Math.round((positive / total) * 100) : 0;

        trendData.push({
          date: dateStr,
          conversations: dayLogs.length,
          satisfactionRate: rate,
          positiveRatings: positive,
          negativeRatings: negative,
        });
      }

      return trendData;
    }),

  /**
   * 获取热门问题排行
   */
  getPopularQuestions: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      days: z.number().min(1).max(90).default(7),
    }))
    .query(async ({ input }) => {
      const { limit, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date();

      const logs = await getChatLogsForDateRange(startDate, endDate);

      // 统计问题频率
      const questionCount = new Map<string, number>();
      logs.forEach(log => {
        const question = log.userMessage.trim();
        if (question) {
          questionCount.set(question, (questionCount.get(question) || 0) + 1);
        }
      });

      // 排序并返回前N个
      const popularQuestions = Array.from(questionCount.entries())
        .map(([question, count]) => ({ question, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return popularQuestions;
    }),

  /**
   * 获取低评分对话列表
   */
  getLowRatedConversations: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      days: z.number().min(1).max(90).default(7),
    }))
    .query(async ({ input }) => {
      const { limit, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date();

      const ratings = await getChatRatingsForDateRange(startDate, endDate);
      const logs = await getChatLogsForDateRange(startDate, endDate);

      // 筛选负面评分
      const negativeRatings = ratings.filter(r => r.rating === "negative");

      // 关联对话记录
      const lowRatedConversations = negativeRatings
        .map(rating => {
          const log = logs.find(l => l.id === rating.chatLogId);
          if (!log) return null;
          return {
            id: log.id,
            userMessage: log.userMessage,
            aiResponse: log.assistantMessage,
            language: log.language,
            createdAt: log.createdAt,
            ratedAt: rating.createdAt,
          };
        })
        .filter(Boolean)
        .slice(0, limit);

      return lowRatedConversations;
    }),
});
