import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { news, InsertNews } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const newsRouter = router({
  /**
   * 获取所有新闻（按日期倒序）
   * 公开访问，用于首页弹窗展示
   */
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const allNews = await db
        .select()
        .from(news)
        .orderBy(desc(news.date));
      
      return allNews;
    } catch (error) {
      console.error("[News] Failed to get all news:", error);
      throw new Error("Failed to fetch news");
    }
  }),

  /**
   * 创建新闻
   * 需要管理员权限
   */
  create: protectedProcedure
    .input(
      z.object({
        date: z.string().or(z.date()),
        content: z.string().max(200, "新闻内容不能超过200个汉字"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 检查是否为管理员
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const newsData: InsertNews = {
          date: typeof input.date === "string" ? new Date(input.date) : input.date,
          content: input.content,
        };

        const result = await db.insert(news).values(newsData);
        return { success: true, id: result[0].insertId };
      } catch (error) {
        console.error("[News] Failed to create news:", error);
        throw new Error("Failed to create news");
      }
    }),

  /**
   * 更新新闻
   * 需要管理员权限
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.string().or(z.date()).optional(),
        content: z.string().max(200, "新闻内容不能超过200个汉字").optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 检查是否为管理员
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const updateData: Partial<InsertNews> = {};
        
        if (input.date) {
          updateData.date = typeof input.date === "string" ? new Date(input.date) : input.date;
        }
        if (input.content) {
          updateData.content = input.content;
        }

        await db
          .update(news)
          .set(updateData)
          .where(eq(news.id, input.id));

        return { success: true };
      } catch (error) {
        console.error("[News] Failed to update news:", error);
        throw new Error("Failed to update news");
      }
    }),

  /**
   * 删除新闻
   * 需要管理员权限
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // 检查是否为管理员
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        await db.delete(news).where(eq(news.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("[News] Failed to delete news:", error);
        throw new Error("Failed to delete news");
      }
    }),
});
