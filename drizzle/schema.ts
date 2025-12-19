import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Chat logs table for AI chatbot
export const chatLogs = mysqlTable("chatLogs", {
  id: int("id").autoincrement().primaryKey(),
  userMessage: text("userMessage").notNull(),
  assistantMessage: text("assistantMessage").notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatLog = typeof chatLogs.$inferSelect;
export type InsertChatLog = typeof chatLogs.$inferInsert;

// Chat ratings table for satisfaction feedback
export const chatRatings = mysqlTable("chatRatings", {
  id: int("id").autoincrement().primaryKey(),
  chatLogId: int("chatLogId").notNull(), // Reference to chatLogs.id
  rating: mysqlEnum("rating", ["positive", "negative"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatRating = typeof chatRatings.$inferSelect;
export type InsertChatRating = typeof chatRatings.$inferInsert;
// News table for company announcements
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  content: varchar("content", { length: 300 }).notNull(), // 扩展到300字
  image1: text("image1"), // 第一张图片URL
  image2: text("image2"), // 第二张图片URL
  image3: text("image3"), // 第三张图片URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;
