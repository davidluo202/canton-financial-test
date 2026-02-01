import cron from "node-cron";
import { executeDailyReportTask } from "./emailReportService";

/**
 * 初始化定时任务调度器
 */
export function initScheduler() {
  console.log("[Scheduler] Initializing scheduled tasks...");

  // 暂停每日邮件报告以降低API用量消耗
  // 每天早上9点（香港时间）发送每日对话报告
  // Cron表达式: 秒 分 时 日 月 周
  // '0 0 9 * * *' = 每天9:00:00
  /*
  const dailyReportSchedule = process.env.DAILY_REPORT_CRON || '0 0 9 * * *';
  
  cron.schedule(dailyReportSchedule, async () => {
    console.log("[Scheduler] Running daily chat report task...");
    try {
      await executeDailyReportTask();
      console.log("[Scheduler] Daily report sent successfully");
    } catch (error) {
      console.error("[Scheduler] Error in daily report task:", error);
    }
  }, {
    timezone: "Asia/Hong_Kong"
  });

  console.log(`[Scheduler] Daily report scheduled at: ${dailyReportSchedule} (Hong Kong Time)`);
  */
  console.log("[Scheduler] Daily email report is currently disabled to reduce API usage");
  console.log("[Scheduler] All scheduled tasks initialized successfully");
}

/**
 * 手动触发每日报告（用于测试）
 */
export async function triggerDailyReportManually(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log("[Scheduler] Manually triggering daily report...");
    await executeDailyReportTask();
    return {
      success: true,
      message: '每日報告已成功生成並發送',
    };
  } catch (error) {
    console.error("[Scheduler] Manual trigger failed:", error);
    return {
      success: false,
      message: `報告生成失敗: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
