import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { knex } from "../database";

export async function mealRoutes(app: FastifyInstance){
  app.post("/", async (request, reply) => {
    const mealSchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean()
    })

    const { name, description, diet} = mealSchema.parse(request.body)

    await knex("meal").insert({
      user_id: randomUUID(),
      name,
      description,
      diet,
      updated_at: new Date(),
      created_at: new Date()
    })

    return reply.status(201).send()

  })

  app.get("/:id", async (request, reply) => {
    const idSchema = z.object({
      id: z.string(),
    })

    const { id } = idSchema.parse(request.params)
    
    const mealSearch = await knex("meal").where({ id }).first()

    if(!mealSearch){
      return reply.status(404).send("Meal not found!")
    }

    return reply.status(200).send(mealSearch)
  })

  app.get("/,", async () => {

  })

  app.delete("/:id", async (request, reply) => {
    const idSchema = z.object({
      id: z.string(),
    })

    const { id } = idSchema.parse(request.params)
    
    const mealSearch = await knex("meal").where({ id }).delete()

    if(!mealSearch){
      return reply.status(404).send("Meal not found!")
    }

    return reply.status(200).send()
  })

  app.put("/:id", async () => {

  })

  app.get("/summary",  async () => {

  })
}