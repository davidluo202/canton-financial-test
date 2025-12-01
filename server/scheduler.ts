import cron from "node-cron";
import { sendDailyChatReport } from "./emailService";

/**
 * 初始化定时任务调度器
 */
export function initScheduler() {
  console.log("[Scheduler] Initializing scheduled tasks...");

  // 每天早上9点（香港时间）发送每日对话报告
  // Cron表达式: 秒 分 时 日 月 周
  // '0 0 9 * * *' = 每天9:00:00
  const dailyReportSchedule = process.env.DAILY_REPORT_CRON || '0 0 9 * * *';
  
  cron.schedule(dailyReportSchedule, async () => {
    console.log("[Scheduler] Running daily chat report task...");
    try {
      const result = await sendDailyChatReport();
      if (result.success) {
        console.log(`[Scheduler] Daily report sent successfully. Conversations: ${result.conversationCount}`);
      } else {
        console.error("[Scheduler] Failed to send daily report:", result.error);
      }
    } catch (error) {
      console.error("[Scheduler] Error in daily report task:", error);
    }
  }, {
    timezone: "Asia/Hong_Kong"
  });

  console.log(`[Scheduler] Daily report scheduled at: ${dailyReportSchedule} (Hong Kong Time)`);
  console.log("[Scheduler] All scheduled tasks initialized successfully");
}

/**
 * 手动触发每日报告（用于测试）
 */
export async function triggerDailyReportManually() {
  console.log("[Scheduler] Manually triggering daily report...");
  return await sendDailyChatReport();
}
