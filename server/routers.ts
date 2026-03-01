import { z } from "zod";
import { SignJWT } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { chatbotRouter } from "./chatbotRouter";
import { emailRouter } from "./emailRouter";
import { dashboardRouter } from "./dashboardRouter";
import { marketRouter } from "./marketRouter";
import { newsRouter } from "./newsRouter";
import { uploadRouter } from "./uploadRouter";
import { initRouter } from "./initRouter";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        // Simple password check using process.env.ADMIN_PASSWORD
        const adminPassword = process.env.ADMIN_PASSWORD || "cmfadmin2026";
        if (input.password === adminPassword) {
          const cookieOptions = getSessionCookieOptions(ctx.req);
          
          const secretKey = new TextEncoder().encode(ENV.cookieSecret);
          const token = await new SignJWT({ role: "admin", openId: "admin" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("30d")
            .sign(secretKey);
            
          ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
          return { success: true };
        }
        throw new Error("Invalid password");
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Chatbot router
  chatbot: chatbotRouter,
  
  // Email service router
  email: emailRouter,
  
  // Dashboard router
  dashboard: dashboardRouter,
  
  // Market data router
  market: marketRouter,
  
  // News router
  news: newsRouter,
  
  // Upload router
  upload: uploadRouter,

  // DB init router (admin only)
  init: initRouter,
});

export type AppRouter = typeof appRouter;
