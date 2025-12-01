import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { verifyEmailConfig, sendDailyChatReport } from "./emailService";
import { triggerDailyReportManually } from "./scheduler";

export const emailRouter = router({
  // 验证SMTP配置
  verifyConfig: publicProcedure.query(async () => {
    const isValid = await verifyEmailConfig();
    return {
      configured: isValid,
      message: isValid
        ? "SMTP configuration is valid and ready to send emails"
        : "SMTP configuration not found or invalid. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS environment variables.",
    };
  }),

  // 手动触发每日报告（用于测试）
  triggerDailyReport: publicProcedure.mutation(async () => {
    const result = await triggerDailyReportManually();
    return result;
  }),

  // 获取SMTP配置状态
  getStatus: publicProcedure.query(() => {
    const hasConfig = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );

    return {
      configured: hasConfig,
      scheduledTime: process.env.DAILY_REPORT_CRON || "0 0 9 * * *",
      timezone: "Asia/Hong_Kong",
      recipientEmail: "customer-services@cmfinancial.com",
    };
  }),
});
