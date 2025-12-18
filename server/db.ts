import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chatLogs, InsertChatLog, chatRatings, InsertChatRating, news, InsertNews } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Chat log functions
export async function saveChatLog(log: Omit<InsertChatLog, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save chat log: database not available");
    return null;
  }

  try {
    const result = await db.insert(chatLogs).values(log);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save chat log:", error);
    return null;
  }
}

export async function getChatLogsForToday() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get chat logs: database not available");
    return [];
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const logs = await db.select().from(chatLogs);
    
    // Filter logs from today
    return logs.filter(log => {
      const logDate = new Date(log.createdAt);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
  } catch (error) {
    console.error("[Database] Failed to get chat logs:", error);
    return [];
  }
}

// Chat rating functions
export async function saveChatRating(rating: Omit<InsertChatRating, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save chat rating: database not available");
    return null;
  }

  try {
    const result = await db.insert(chatRatings).values(rating);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save chat rating:", error);
    return null;
  }
}

export async function getChatRatingsForToday() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get chat ratings: database not available");
    return [];
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ratings = await db.select().from(chatRatings);
    
    // Filter ratings from today
    return ratings.filter(rating => {
      const ratingDate = new Date(rating.createdAt);
      ratingDate.setHours(0, 0, 0, 0);
      return ratingDate.getTime() === today.getTime();
    });
  } catch (error) {
    console.error("[Database] Failed to get chat ratings:", error);
    return [];
  }
}

export async function getRatingForChatLog(chatLogId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get rating: database not available");
    return null;
  }

  try {
    const result = await db.select().from(chatRatings).where(eq(chatRatings.chatLogId, chatLogId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get rating:", error);
    return null;
  }
}

export async function getChatLogsForDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get chat logs: database not available");
    return [];
  }

  try {
    const logs = await db.select().from(chatLogs);
    
    // Filter logs within date range
    return logs.filter(log => {
      const logDate = new Date(log.createdAt);
      return logDate >= startDate && logDate <= endDate;
    });
  } catch (error) {
    console.error("[Database] Failed to get chat logs for date range:", error);
    return [];
  }
}

export async function getChatRatingsForDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get chat ratings: database not available");
    return [];
  }

  try {
    const ratings = await db.select().from(chatRatings);
    
    // Filter ratings within date range
    return ratings.filter(rating => {
      const ratingDate = new Date(rating.createdAt);
      return ratingDate >= startDate && ratingDate <= endDate;
    });
  } catch (error) {
    console.error("[Database] Failed to get chat ratings for date range:", error);
    return [];
  }
}
