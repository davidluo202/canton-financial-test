import { getChatLogsForToday } from "./db";

/**
 * 生成对话记录的HTML邮件内容
 */
function generateEmailHTML(logs: any[], date: string) {
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
            <p><strong>Total Conversations / 總對話數:</strong> ${logs.length}</p>
            <p><strong>Chinese Conversations / 中文對話:</strong> ${logs.filter(l => l.language === 'zh').length}</p>
            <p><strong>English Conversations / 英文對話:</strong> ${logs.filter(l => l.language === 'en').length}</p>
          </div>
          
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
 * 发送每日对话记录邮件
 * 注意：这是一个简化版本，实际发送需要配置SMTP服务或使用邮件API
 */
export async function sendDailyChatReport() {
  try {
    const logs = await getChatLogsForToday();
    const today = new Date().toLocaleDateString('zh-HK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const emailHTML = generateEmailHTML(logs, today);
    
    console.log('[Email Service] Daily chat report generated');
    console.log(`[Email Service] Total conversations: ${logs.length}`);
    
    // 在实际生产环境中，这里应该使用SMTP服务或邮件API发送邮件
    // 例如使用 nodemailer 或云服务商的邮件API
    // 由于这是演示版本，我们只记录日志
    
    // 示例代码（需要配置SMTP）：
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.sendMail({
    //   from: 'noreply@cmfinancial.com',
    //   to: 'customer-services@cmfinancial.com',
    //   subject: `AI Chatbot Daily Report - ${today}`,
    //   html: emailHTML,
    // });
    
    // 临时方案：将邮件内容保存到文件
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const reportsDir = path.join(process.cwd(), 'chat-reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const filename = `chat-report-${new Date().toISOString().split('T')[0]}.html`;
    const filepath = path.join(reportsDir, filename);
    
    await fs.writeFile(filepath, emailHTML, 'utf-8');
    
    console.log(`[Email Service] Report saved to: ${filepath}`);
    console.log('[Email Service] In production, this would be sent to: customer-services@cmfinancial.com');
    
    return {
      success: true,
      conversationCount: logs.length,
      reportPath: filepath,
    };
  } catch (error) {
    console.error('[Email Service] Failed to send daily report:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}
