import fastify from "fastify"
import { env } from "./env"
import { userRoutes } from "./routes/users"
import { mealRoutes } from "./routes/meals"
import cookie from "@fastify/cookie"

const app = fastify()

app.register(cookie)

app.register(userRoutes, { prefix: "user"})
app.register(mealRoutes, { prefix: "meal"})

app.listen({
  port: env.PORT
}).then(() => {
  console.log(`HTTP Server Running Port ${env.PORT} 🔥🔥🔥`)
})