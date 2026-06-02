import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { verifyEmailConfig, sendDailyChatReport } from "./emailService";
import { triggerDailyReportManually } from "./scheduler";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const emailRouter = router({
  submitContactForm: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required").max(200),
      email: z.string().email("Invalid email format").max(200),
      phone: z.string().max(50).optional(),
      subject: z.string().min(1, "Subject is required").max(500),
      message: z.string().min(10, "Message must be at least 10 characters").max(5000)
    }))
    .mutation(async ({ input }) => {
      const { sendEmail } = await import("./emailService");

      const html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(input.phone || 'N/A')}</p>
        <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
      `;

      const success = await sendEmail({
        to: "customer-services@cmfinancial.com",
        subject: `Website Contact: ${input.subject}`,
        html,
      });

      if (!success) {
        throw new Error("Failed to send message. Please try again later.");
      }

      return { success: true };
    }),

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
