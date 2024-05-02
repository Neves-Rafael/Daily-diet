import { knex } from "knex"

declare module "knex/types/tables" {
  export interface Tables {
    users : {
      id: string
      name: string
      email: string
      password: string
      updated_at: string
      created_at: string
    },
    meal : {
      id: string
      user_id: string
      name: string
      description: string
      diet: boolean
      updated_at: string
      created_at: string
    }
  }
}