import fastify from "fastify"
import { userRoutes } from "./routes/users"
import { mealRoutes } from "./routes/meals"
import cookie from "@fastify/cookie"

export const app = fastify()

app.register(cookie)

app.register(userRoutes, { prefix: "user"})
app.register(mealRoutes, { prefix: "meal"})