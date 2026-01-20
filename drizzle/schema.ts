import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

// Define enums first
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const ratingEnum = pgEnum("rating", ["positive", "negative"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Chat logs table for AI chatbot
export const chatLogs = pgTable("chatLogs", {
  id: serial("id").primaryKey(),
  userMessage: text("userMessage").notNull(),
  assistantMessage: text("assistantMessage").notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatLog = typeof chatLogs.$inferSelect;
export type InsertChatLog = typeof chatLogs.$inferInsert;

// Chat ratings table for satisfaction feedback
export const chatRatings = pgTable("chatRatings", {
  id: serial("id").primaryKey(),
  chatLogId: integer("chatLogId").notNull(), // Reference to chatLogs.id
  rating: ratingEnum("rating").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatRating = typeof chatRatings.$inferSelect;
export type InsertChatRating = typeof chatRatings.$inferInsert;

// News table for company announcements
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  content: varchar("content", { length: 300 }).notNull(), // 扩展到300字
  image1: text("image1"), // 第一张图片URL
  image2: text("image2"), // 第二张图片URL
  image3: text("image3"), // 第三张图片URL
  image4: text("image4"), // 第四张图片URL
  image5: text("image5"), // 第五张图片URL
  image6: text("image6"), // 第六张图片URL
  image7: text("image7"), // 第七张图片URL
  image8: text("image8"), // 第八张图片URL
  image9: text("image9"), // 第九张图片URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;
