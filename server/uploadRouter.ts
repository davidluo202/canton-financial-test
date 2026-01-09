import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage-s3";

export const uploadRouter = router({
  uploadImage: publicProcedure
    .input(
      z.object({
        imageData: z.string(), // base64 data URL
        consoleAuth: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Verify console auth
      if (input.consoleAuth !== "console_admin_session") {
        throw new Error("Unauthorized");
      }

      try {
        // Extract base64 data
        const base64Data = input.imageData.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const filename = `news/${timestamp}-${random}.jpg`;

        // Upload to S3
        const { url } = await storagePut(filename, buffer, "image/jpeg");

        return { url };
      } catch (error) {
        console.error("Image upload error:", error);
        throw new Error("Failed to upload image");
      }
    }),
});
