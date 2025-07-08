import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

const env = createEnv({
  client: {
    NEXT_PUBLIC_IS_SHOWN_PWA_PROMPT: z
      .string()
      .default("false")
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_IS_SHOWN_PWA_PROMPT:
      process.env.NEXT_PUBLIC_IS_SHOWN_PWA_PROMPT,
  },
  server: {},
});

export default env;
