import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary()

  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}


// table.string("name").notNullable()
// table.string("email").notNullable()
// table.string("password").notNullable()
// table.timestamp("updated_at").defaultTo(knex.fn.now())
// table.timestamp("created_at").defaultTo(knex.fn.now())