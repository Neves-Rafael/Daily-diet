import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { knex } from "../database";
import { checkSessionId } from "../middlewares/check-session-id";

export async function mealRoutes(app: FastifyInstance){
  app.post("/",{ preHandler: [checkSessionId]}, async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean()
    })

    const { name, description, diet} = createMealSchema.parse(request.body)

    const { sessionId } = request.cookies
    console.log(sessionId)

    await knex("meal").insert({
      user_id: sessionId,
      name,
      description,
      diet,
      updated_at: new Date().toString(),
      created_at: new Date().toString()
    })

    return reply.status(201).send()

  })

  app.get("/:id", async (request, reply) => {
    const idParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = idParamsSchema.parse(request.params)
    
    const mealSearch = await knex("meal").where({ id }).first()

    if(!mealSearch){
      return reply.status(404).send("Meal not found!")
    }

    return reply.status(200).send(mealSearch)
  })

  app.get("/,", async () => {
    const meals = await knex("meals").where({ id: 2 })

    return {
      meals
    }
  })

  app.delete("/:id", async (request, reply) => {
    const idParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = idParamsSchema.parse(request.params)
    
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