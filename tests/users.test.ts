import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { app } from "../src/app"
import request from "supertest"

describe("User routes", () => {
  beforeAll( async () => {
    await app.ready()
  })

  afterAll( async () => {
    await app.close()
  })

  test("User can create a new account", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafsdael",
      email: "absdsacs6ss565@gmaail.com",
      password: "12345",
    }).expect(201)

  })

  test("User can make a login and create a sessionId", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafsdael",
      email: "a@gmaail.com",
      password: "12345",
    })

    const login = await request(app.server).post("/user/signin").send({
      email: "a@gmaail.com",
      password: "12345",
    }).expect(201)

    const cookie = login.get("Set-Cookie")
    
    expect(cookie).toBeTruthy()
  })

  test.only("User can make logout", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafsdael",
      email: "a@gmaail.com",
      password: "12345",
    })

    const logout = await request(app.server).delete("/user/logout").expect(200)

    const cookie = logout.get("Set-Cookie")

    expect(cookie?.[0]).toMatch(/sessionId=;/)
  })
})