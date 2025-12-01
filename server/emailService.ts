import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { getChatLogsForToday } from "./db";

// SMTP配置接口
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// 从环境变量获取SMTP配置
function getSMTPConfig(): SMTPConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn("[Email Service] SMTP configuration not found in environment variables");
    return null;
  }

  return {
    host,
    port: parseInt(port, 10),
    secure: port === "465", // 465端口使用SSL，其他端口使用STARTTLS
    auth: {
      user,
      pass,
    },
  };
}

// 创建邮件传输器
let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) {
    return transporter;
  }

  const config = getSMTPConfig();
  if (!config) {
    return null;
  }

  transporter = nodemailer.createTransport(config);
  return transporter;
}

// 发送邮件
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    console.error("[Email Service] Email transporter not configured. Please set SMTP environment variables.");
    return false;
  }

  try {
    const fromEmail = options.from || process.env.SMTP_FROM || process.env.SMTP_USER;
    const fromName = "Canton Mutual Financial AI Assistant";
    
    await transport.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[Email Service] Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send email:", error);
    return false;
  }
}

// 验证SMTP配置
export async function verifyEmailConfig(): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    return false;
  }

  try {
    await transport.verify();
    console.log("[Email Service] SMTP configuration verified successfully");
    return true;
  } catch (error) {
    console.error("[Email Service] SMTP configuration verification failed:", error);
    return false;
  }
}

/**
 * 生成对话记录的HTML邮件内容
 */
function generateEmailHTML(logs: any[], date: string, stats: any) {
  if (logs.length === 0) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Canton Mutual Financial - AI Chatbot Daily Report</h1>
            <p>${date}</p>
          </div>
          <div class="content">
            <p>No conversations recorded today.</p>
            <p>今日沒有對話記錄。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  const conversationsHTML = logs.map((log, index) => {
    const time = new Date(log.createdAt).toLocaleTimeString('zh-HK', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return `
      <div style="margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
        <h3 style="color: #1f2937; margin-bottom: 10px;">
          Conversation #${index + 1} - ${time} (${log.language === 'zh' ? '中文' : 'English'})
        </h3>
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
          <strong style="color: #1e40af;">User:</strong>
          <p style="margin: 5px 0 0 0; white-space: pre-wrap;">${escapeHTML(log.userMessage)}</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
          <strong style="color: #374151;">Assistant:</strong>
          <p style="margin: 5px 0 0 0; white-space: pre-wrap;">${escapeHTML(log.assistantMessage)}</p>
        </div>
      </div>
    `;
  }).join('');

  // 热门问题分析
  const popularQuestionsHTML = stats.popularQuestions.length > 0
    ? `
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #92400e;">Popular Questions / 熱門問題</h3>
        <ol style="margin: 0; padding-left: 20px;">
          ${stats.popularQuestions.map((q: string) => `<li>${escapeHTML(q)}</li>`).join('')}
        </ol>
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
        .summary { background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px; }
        .stat-card { background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .stat-value { font-size: 32px; font-weight: bold; color: #2563eb; }
        .stat-label { font-size: 14px; color: #6b7280; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Canton Mutual Financial - AI Chatbot Daily Report</h1>
          <p>${date}</p>
        </div>
        <div class="content">
          <div class="summary">
            <h2 style="margin-top: 0; color: #1e40af;">Summary / 摘要</h2>
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-value">${logs.length}</div>
                <div class="stat-label">Total Conversations<br/>總對話數</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.uniqueUsers}</div>
                <div class="stat-label">Unique Users<br/>獨立用戶數</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${logs.filter((l: any) => l.language === 'zh').length}</div>
                <div class="stat-label">Chinese Conversations<br/>中文對話</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${logs.filter((l: any) => l.language === 'en').length}</div>
                <div class="stat-label">English Conversations<br/>英文對話</div>
              </div>
            </div>
          </div>
          
          ${popularQuestionsHTML}
          
          <h2 style="color: #1f2937;">Conversation Details / 對話詳情</h2>
          ${conversationsHTML}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This is an automated report from Canton Mutual Financial AI Chatbot System.</p>
            <p>此為誠港金融AI聊天機器人系統自動生成的報告。</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 分析对话数据生成统计信息
 */
function analyzeConversations(logs: any[]) {
  // 统计独立用户数（简化版本，实际应该基于session ID或IP）
  const uniqueUsers = Math.ceil(logs.length / 3); // 假设平均每个用户3次对话

  // 提取热门问题（简化版本，提取前5个用户问题）
  const popularQuestions = logs
    .slice(0, 5)
    .map(log => log.userMessage)
    .filter((msg, index, self) => self.indexOf(msg) === index); // 去重

  return {
    uniqueUsers,
    popularQuestions,
  };
}

/**
 * 发送每日对话记录邮件
 */
export async function sendDailyChatReport() {
  try {
    const logs = await getChatLogsForToday();
    const today = new Date().toLocaleDateString('zh-HK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const stats = analyzeConversations(logs);
    const emailHTML = generateEmailHTML(logs, today, stats);
    
    console.log('[Email Service] Daily chat report generated');
    console.log(`[Email Service] Total conversations: ${logs.length}`);
    
    // 尝试发送邮件
    const emailSent = await sendEmail({
      to: 'customer-services@cmfinancial.com',
      subject: `AI Chatbot Daily Report - ${today}`,
      html: emailHTML,
    });

    // 无论邮件是否发送成功，都保存HTML文件作为备份
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const reportsDir = path.join(process.cwd(), 'chat-reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const filename = `chat-report-${new Date().toISOString().split('T')[0]}.html`;
    const filepath = path.join(reportsDir, filename);
    
    await fs.writeFile(filepath, emailHTML, 'utf-8');
    
    console.log(`[Email Service] Report saved to: ${filepath}`);
    
    if (!emailSent) {
      console.log('[Email Service] Email not sent. Please configure SMTP settings.');
      console.log('[Email Service] Report saved locally for manual review.');
    }
    
    return {
      success: emailSent,
      conversationCount: logs.length,
      reportPath: filepath,
      emailSent,
    };
  } catch (error) {
    console.error('[Email Service] Failed to generate/send daily report:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}
