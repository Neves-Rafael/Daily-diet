import fastify from "fastify"
import { env } from "./env"
import { userRoutes } from "./routes/users"
import { mealRoutes } from "./routes/meals"

const app = fastify()
app.register(userRoutes, { prefix: "user"})
app.register(mealRoutes, { prefix: "meal"})

app.listen({
  port: env.PORT
}).then(() => {
  console.log(`HTTP Server Running Port ${env.PORT} 🔥🔥🔥`)
})