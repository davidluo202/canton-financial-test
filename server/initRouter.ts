import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

export const initRouter = router({
  // Initialize database tables directly via SQL
  createTables: publicProcedure
    .input(z.object({
      password: z.string()
    }))
    .mutation(async ({ input }) => {
      // Check admin password to prevent unauthorized access
      const adminPassword = process.env.ADMIN_PASSWORD || "cmfadmin2026";
      if (input.password !== adminPassword) {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database connection not available");
      }

      try {
        console.log("[Init] Starting database table creation...");
        
        // Create news table
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS \`news\` (
            \`id\` int AUTO_INCREMENT NOT NULL,
            \`date\` timestamp NOT NULL,
            \`content\` varchar(300) NOT NULL,
            \`image1\` text,
            \`image2\` text,
            \`image3\` text,
            \`image4\` text,
            \`image5\` text,
            \`image6\` text,
            \`image7\` text,
            \`image8\` text,
            \`image9\` text,
            \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
          );
        `);
        console.log("[Init] Created news table");

        // Create users table
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS \`users\` (
            \`id\` int AUTO_INCREMENT NOT NULL,
            \`openId\` varchar(64) NOT NULL,
            \`name\` text,
            \`email\` varchar(320),
            \`loginMethod\` varchar(64),
            \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
            \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            \`lastSignedIn\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`users_openId_unique\` (\`openId\`)
          );
        `);
        console.log("[Init] Created users table");

        return { success: true, message: "Tables created successfully" };
      } catch (error) {
        console.error("[Init] Failed to create tables:", error);
        throw new Error(`Failed to create tables: ${error instanceof Error ? error.message : String(error)}`);
      }
    }),
});
