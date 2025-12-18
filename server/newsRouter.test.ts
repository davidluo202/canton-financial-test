import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { news } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("News Router", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database not available for testing");
    }
  });

  describe("getAll", () => {
    it("should return all news in descending order by date", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.news.getAll();
      
      expect(Array.isArray(result)).toBe(true);
      
      // Check if sorted by date descending
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          const currentDate = new Date(result[i].date);
          const nextDate = new Date(result[i + 1].date);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      }
    });
  });

  describe("create (admin only)", () => {
    it("should reject non-admin users", async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: "test", role: "user" } as any,
        req: {} as any,
        res: {} as any,
      });

      await expect(
        caller.news.create({
          date: new Date().toISOString(),
          content: "Test news content",
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should allow admin users to create news", async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: "admin", role: "admin" } as any,
        req: {} as any,
        res: {} as any,
      });

      const testDate = new Date("2024-12-17");
      const testContent = "测试新闻内容";

      const result = await caller.news.create({
        date: testDate.toISOString(),
        content: testContent,
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();

      // Cleanup
      if (db && result.id) {
        await db.delete(news).where(eq(news.id, result.id));
      }
    });

    it("should reject content longer than 200 characters", async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: "admin", role: "admin" } as any,
        req: {} as any,
        res: {} as any,
      });

      const longContent = "测".repeat(201);

      await expect(
        caller.news.create({
          date: new Date().toISOString(),
          content: longContent,
        })
      ).rejects.toThrow();
    });
  });

  describe("update (admin only)", () => {
    it("should reject non-admin users", async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: "test", role: "user" } as any,
        req: {} as any,
        res: {} as any,
      });

      await expect(
        caller.news.update({
          id: 1,
          content: "Updated content",
        })
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("delete (admin only)", () => {
    it("should reject non-admin users", async () => {
      const caller = appRouter.createCaller({
        user: { id: 1, openId: "test", role: "user" } as any,
        req: {} as any,
        res: {} as any,
      });

      await expect(
        caller.news.delete({ id: 1 })
      ).rejects.toThrow("Unauthorized");
    });
  });
});
