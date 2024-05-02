import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { knex } from "../database";
import { hash, compare} from "bcryptjs"

export async function userRoutes(app: FastifyInstance){
  app.post("/signup", async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserSchema.parse(request.body)

    // const verifyUserExist = await knex("users").where({ email }).first()

    // if(verifyUserExist.length > 0){
    //   return reply.status(400).send("Email already used, try another email!")
    // }

    const passwordHash = await hash(password, 6)

    const user = await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      password: passwordHash,
      updated_at: new Date().toString(),
      created_at: new Date().toString(),
    }).returning(["id", "name", "email"])

    
    return reply.status(201).send(user)
  })

  app.post("/signin", async (request, reply) => {
    const createUserSchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createUserSchema.parse(request.body)

    const verifyUserExist = await knex("users").where({ email }).first()

    if(!verifyUserExist){
      return reply.status(400).send("User not found!")
    }

    const passwordMatch = await compare(password, verifyUserExist.password)

    if(!passwordMatch){
      return reply.status(400).send("Email or password are wrong, verify and try again!")
    }

    return reply.status(201).send()
  })

  app.delete("/logout", async () => {
    //Remove user permission
  })
}