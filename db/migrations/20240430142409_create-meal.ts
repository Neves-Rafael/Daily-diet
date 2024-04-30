import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meal", (table) => {
    table.increments("id").primary()
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE").notNullable()
    table.text("name").notNullable()
    table.text("description")
    table.boolean("diet").notNullable()
    table.timestamp("updated_at").defaultTo(knex.fn.now())
    table.timestamp("created_at").defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meal")
}

