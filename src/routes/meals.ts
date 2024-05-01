import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { knex } from "../database";

export async function mealRoutes(app: FastifyInstance){
  app.post("/", async () => {

  })
}