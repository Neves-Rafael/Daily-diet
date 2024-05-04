import { knex as knexSetup, Knex } from "knex"
import { env } from "./env"

export const config: Knex.Config = {
  client: env.DATABASE_CLIENTE,
  connection: env.DATABASE_CLIENTE === "sqlite" ? {
    filename: env.DATABASE_URL
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
}

export const knex = knexSetup(config)