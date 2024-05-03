import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { knex } from "../database";
import { checkSessionId } from "../middlewares/check-session-id";

export async function mealRoutes(app: FastifyInstance){
  app.post("/",{ preHandler: [checkSessionId] }, async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.number()
    })

    const { name, description, diet } = createMealSchema.parse(request.body)
    const { sessionId } = request.cookies

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

  app.get("/:id",{ preHandler: [checkSessionId] }, async (request, reply) => {
    const idParamsSchema = z.object({
      id: z.string(),
    })

    const { sessionId } = request.cookies

    const { id } = idParamsSchema.parse(request.params)
    
    const mealSearch = await knex("meal").where({ id, user_id: sessionId }).first()

    if(!mealSearch){
      return reply.status(404).send("Meal not found!")
    }

    return reply.status(200).send(mealSearch)
  })

  app.get("/",{ preHandler: [checkSessionId] }, async (request, reply) => {

    const { sessionId } = request.cookies

    const meals = await knex("meal").where({ user_id: sessionId })

    return reply.status(200).send({
      meals
    })
  })

  app.delete("/:id",{ preHandler: [checkSessionId] }, async (request, reply) => {
    const idParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = idParamsSchema.parse(request.params)
    const { sessionId } = request.cookies
    
    const mealSearch = await knex("meal").where({ id, user_id: sessionId }).first().delete()

    if(!mealSearch){
      return reply.status(404).send("Meal not found!")
    }

    return reply.status(200).send()
  })

  app.put("/:id",{ preHandler: [checkSessionId] }, async (request, reply) => {
    const idSchema = z.object({
      id: z.string(), 
    })
    const mealsUpdateSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      diet: z.number().optional()
    })

    const { id } = idSchema.parse(request.params)
    const { name, description, diet } = mealsUpdateSchema.parse(request.body)
    const { sessionId } = request.cookies

    console.log(id, name, description, diet)

    const verifyMeal = await knex("meal").where({
      id, user_id: sessionId
    }).first()

    if(!verifyMeal){
      return reply.status(404).send({
        error: "Meal not found."
      })
    }

    await knex("meal").where({
      id, user_id: sessionId
    }).update({
      name: name ? name : verifyMeal.name,
      description: description ? description : verifyMeal.description,
      diet: diet ? diet : verifyMeal.diet,
      updated_at: new Date().toString(),
    })

    return reply.status(200).send({
      message: "Update has successful!"
    })

  })

  app.get("/summary",{ preHandler: [checkSessionId] },  async (request, reply) => {
    const { sessionId } = request.cookies

    const summaryUserResult = await knex("meal").where({user_id: sessionId})

    let inDiet = 0
    let outDiet = 0
    let dietSequence = 0
    let count = 0

    summaryUserResult.map((meal) => {
      if(meal.diet === 1){
        count++
        inDiet++
        if(count > dietSequence){
          dietSequence = count
        }
      } else {
        outDiet++
        count = 0
      }
    })

    return reply.status(200).send({
      "total-meals": summaryUserResult.length,
      "in-diet": inDiet,
      "out-diet": outDiet,
      "diet-sequence": dietSequence
    })
  })
}