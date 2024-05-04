import { config } from "dotenv"
import { z } from "zod"

if(process.env.NODE_ENV === "test"){
  config({ path: ".env.test" })
} else {
  config()
}

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333)
}).safeParse(process.env)

if(envSchema.success === false){
  console.error("Invalid environment variables! 🤯🤯🤯", envSchema.error.format())
  throw new Error("Invalid environment variables.")
}

export const env  = envSchema.data