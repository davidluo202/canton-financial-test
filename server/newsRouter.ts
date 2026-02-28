import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { news } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";

// Console authentication token (simple implementation)
const CONSOLE_AUTH_TOKEN = "console_admin_session";



export const newsRouter = router({
  debugDb: publicProcedure.query(async () => {
    return {
      hasUrl: !!process.env.DATABASE_URL,
      urlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : null,
    };
  }),

  // Get all news (public, no auth required)
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const allNews = await db.select().from(news).orderBy(desc(news.date));
    return allNews;
  }),

  // Create news (requires console auth)
  create: publicProcedure
    .input(
      z.object({
        date: z.string(),
        content: z.string().max(300),
        image1: z.string().optional(),
        image2: z.string().optional(),
        image3: z.string().optional(),
        image4: z.string().optional(),
        image5: z.string().optional(),
        image6: z.string().optional(),
        image7: z.string().optional(),
        image8: z.string().optional(),
        image9: z.string().optional(),
        consoleAuth: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Check console authentication
      if (input.consoleAuth !== CONSOLE_AUTH_TOKEN) {
        throw new Error("Unauthorized: Invalid console authentication");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const result = await db.insert(news).values({
        date: new Date(input.date),
        content: input.content,
        image1: input.image1 || null,
        image2: input.image2 || null,
        image3: input.image3 || null,
        image4: input.image4 || null,
        image5: input.image5 || null,
        image6: input.image6 || null,
        image7: input.image7 || null,
        image8: input.image8 || null,
        image9: input.image9 || null,
      });

      return { success: true, id: result[0].insertId };
    }),

  // Update news (requires console auth)
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.string(),
        content: z.string().max(300),
        image1: z.string().optional(),
        image2: z.string().optional(),
        image3: z.string().optional(),
        image4: z.string().optional(),
        image5: z.string().optional(),
        image6: z.string().optional(),
        image7: z.string().optional(),
        image8: z.string().optional(),
        image9: z.string().optional(),
        consoleAuth: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Check console authentication
      if (input.consoleAuth !== CONSOLE_AUTH_TOKEN) {
        throw new Error("Unauthorized: Invalid console authentication");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .update(news)
        .set({
          date: new Date(input.date),
          content: input.content,
          image1: input.image1 || null,
          image2: input.image2 || null,
          image3: input.image3 || null,
          image4: input.image4 || null,
          image5: input.image5 || null,
          image6: input.image6 || null,
          image7: input.image7 || null,
          image8: input.image8 || null,
          image9: input.image9 || null,
        })
        .where(eq(news.id, input.id));

      return { success: true };
    }),

  // Delete news (requires console auth)
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
        consoleAuth: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Check console authentication
      if (input.consoleAuth !== CONSOLE_AUTH_TOKEN) {
        throw new Error("Unauthorized: Invalid console authentication");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(news).where(eq(news.id, input.id));
      return { success: true };
    }),

  // Upload image to S3 (simplified - returns data URL for now)
  uploadImage: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        consoleAuth: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Check console authentication
      if (input.consoleAuth !== CONSOLE_AUTH_TOKEN) {
        throw new Error("Unauthorized: Invalid console authentication");
      }

      // For now, return the data URL directly
      // In production, this should upload to S3
      const ext = input.fileName.split(".").pop();
      const dataUrl = `data:image/${ext};base64,${input.fileData}`;

      return { success: true, url: dataUrl };
    }),
});
