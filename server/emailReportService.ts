import ExcelJS from 'exceljs';
import nodemailer from 'nodemailer';
import { getDb } from './db';
import { chatLogs } from '../drizzle/schema';
import { gte, lte, sql } from 'drizzle-orm';

/**
 * 生成每日AI Chatbot对话记录Excel报告
 * @param date 报告日期（默认为前一天）
 * @returns Excel文件的Buffer
 */
export async function generateDailyReportExcel(date?: Date): Promise<Buffer> {
  const reportDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000); // 默认前一天
  
  // 设置日期范围：当天00:00:00 到 23:59:59
  const startOfDay = new Date(reportDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(reportDate);
  endOfDay.setHours(23, 59, 59, 999);

  // 从数据库查询对话记录
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }
  
  const conversations = await db
    .select()
    .from(chatLogs)
    .where(
      sql`${chatLogs.createdAt} >= ${startOfDay} AND ${chatLogs.createdAt} <= ${endOfDay}`
    )
    .orderBy(chatLogs.createdAt);

  // 创建Excel工作簿
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('AI Chatbot對話記錄');

  // 设置列
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: '用戶消息', key: 'userMessage', width: 50 },
    { header: '機器人回覆', key: 'assistantMessage', width: 50 },
    { header: '語言', key: 'language', width: 10 },
    { header: '時間戳', key: 'createdAt', width: 20 },
  ];

  // 设置表头样式
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // 添加数据行
  conversations.forEach((conv: typeof chatLogs.$inferSelect) => {
    worksheet.addRow({
      id: conv.id,
      userMessage: conv.userMessage,
      assistantMessage: conv.assistantMessage,
      language: conv.language === 'zh' ? '繁體中文' : 'English',
      createdAt: conv.createdAt.toLocaleString('zh-HK', {
        timeZone: 'Asia/Hong_Kong',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
  });

  // 自动调整行高
  worksheet.eachRow((row) => {
    row.alignment = { vertical: 'top', wrapText: true };
  });

  // 生成Buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * 生成统计摘要
 * @param date 报告日期
 * @returns 统计摘要对象
 */
export async function generateStatisticsSummary(date?: Date): Promise<{
  totalCount: number;
  zhCount: number;
  enCount: number;
  reportDate: string;
}> {
  const reportDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const startOfDay = new Date(reportDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(reportDate);
  endOfDay.setHours(23, 59, 59, 999);

  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }
  
  const conversations = await db
    .select()
    .from(chatLogs)
    .where(
      sql`${chatLogs.createdAt} >= ${startOfDay} AND ${chatLogs.createdAt} <= ${endOfDay}`
    );

  const zhCount = conversations.filter((c: typeof chatLogs.$inferSelect) => c.language === 'zh').length;
  const enCount = conversations.filter((c: typeof chatLogs.$inferSelect) => c.language === 'en').length;

  return {
    totalCount: conversations.length,
    zhCount,
    enCount,
    reportDate: reportDate.toLocaleDateString('zh-HK', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
  };
}

/**
 * 发送每日报告邮件
 * @param excelBuffer Excel文件Buffer
 * @param stats 统计摘要
 */
export async function sendDailyReportEmail(
  excelBuffer: Buffer,
  stats: {
    totalCount: number;
    zhCount: number;
    enCount: number;
    reportDate: string;
  }
): Promise<void> {
  // 创建邮件传输器
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
  const toEmail = process.env.REPORT_EMAIL_TO || 'customer-services@cmfinancial.com';

  // 邮件内容
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: `Canton Financial - AI Chatbot對話記錄報告 - ${stats.reportDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Canton Mutual Financial Limited</h2>
        <h3>AI Chatbot對話記錄報告</h3>
        
        <p>尊敬的客服團隊：</p>
        
        <p>附件為 <strong>${stats.reportDate}</strong> 的AI Chatbot對話記錄，共 <strong>${stats.totalCount}</strong> 條對話。</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin-top: 0;">統計摘要：</h4>
          <ul style="list-style: none; padding: 0;">
            <li>📊 總對話數：<strong>${stats.totalCount}</strong> 條</li>
            <li>🇭🇰 繁體中文對話：<strong>${stats.zhCount}</strong> 條</li>
            <li>🇬🇧 英文對話：<strong>${stats.enCount}</strong> 條</li>
          </ul>
        </div>
        
        <p>請查收。</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #6b7280;">
          此郵件由系統自動發送，請勿回覆。<br>
          Canton Mutual Financial Limited<br>
          Units 2304-5, 23/F, 308 Central Des Voeux Road Central, Hong Kong
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `AI_Chatbot_Conversations_${stats.reportDate.replace(/\//g, '-')}.xlsx`,
        content: excelBuffer,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  };

  // 发送邮件
  await transporter.sendMail(mailOptions);
  console.log(`[EmailReport] 報告已發送到 ${toEmail}`);
}

/**
 * 执行每日报告任务（主函数）
 */
export async function executeDailyReportTask(): Promise<void> {
  try {
    console.log('[EmailReport] 開始生成每日報告...');
    
    // 生成统计摘要
    const stats = await generateStatisticsSummary();
    console.log(`[EmailReport] 統計摘要：總計 ${stats.totalCount} 條對話`);
    
    // 生成Excel文件
    const excelBuffer = await generateDailyReportExcel();
    console.log('[EmailReport] Excel文件生成完成');
    
    // 发送邮件
    await sendDailyReportEmail(excelBuffer, stats);
    console.log('[EmailReport] 每日報告任務完成');
  } catch (error) {
    console.error('[EmailReport] 每日報告任務失敗:', error);
    throw error;
  }
}
