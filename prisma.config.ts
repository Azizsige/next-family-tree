import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    // Gunakan fungsi env() bawaan Prisma, bukan process.env
    url: env("DIRECT_URL"),
  },
});
