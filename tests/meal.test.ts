import { app } from "../src/app"
import request from "supertest"
import { execSync } from "node:child_process"
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest"

describe("Meal routes", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all")
    execSync("npm run knex migrate:latest")
  })

  test("it is possible to create a meal", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafael",
      email: "test@gmail.com",
      password: "12345",
    })

    const login = await request(app.server).post("/user/signin").send({
      email: "test@gmail.com",
      password: "12345",
    })

    const cookie = login.get("Set-Cookie")
    
    if(!cookie){
      throw new Error("Cookies not found")
    }
    
    const createMeal = await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "test meal",
      description: "test meal description",
      diet: 1,
    }).expect(201)

    expect(createMeal.body).toEqual([
      expect.objectContaining({
        name: "test meal",
        description: "test meal description",
        diet: 1,
      }),
    ])
  })

  test("Get specific meal", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafael",
      email: "test@gmail.com",
      password: "12345",
    })

    const login = await request(app.server).post("/user/signin").send({
      email: "test@gmail.com",
      password: "12345",
    })

    const cookie = login.get("Set-Cookie")
    
    if(!cookie){
      throw new Error("Cookies not found")
    }

    const createMeal = await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "test meal",
      description: "test meal description",
      diet: 1,
    }).expect(201)

    const getMealById = await request(app.server).get("/meal/1").set("Cookie", cookie).expect(200)

    expect(createMeal.body[0].id).toEqual(getMealById.body.id)

  })

  test("Get all meals", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafael",
      email: "test@gmail.com",
      password: "12345",
    })

    const login = await request(app.server).post("/user/signin").send({
      email: "test@gmail.com",
      password: "12345",
    })

    const cookie = login.get("Set-Cookie")
    
    if(!cookie){
      throw new Error("Cookies not found")
    }

    await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "test meal",
      description: "test meal description",
      diet: 1,
    }).expect(201)

    await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "lunch",
      description: "lunch description",
      diet: 0,
    }).expect(201)

    const mealResult = await request(app.server).get("/meal").set("Cookie", cookie).expect(200)
  
    expect(mealResult.body.meals).toHaveLength(2)
    
    // validate order 
    expect(mealResult.body.meals[0].name).toEqual("test meal")
    expect(mealResult.body.meals[1].name).toEqual("lunch")
  })

  test("Update specific meal", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafael",
      email: "test@gmail.com",
      password: "12345",
    })

    const login = await request(app.server).post("/user/signin").send({
      email: "test@gmail.com",
      password: "12345",
    })

    const cookie = login.get("Set-Cookie")
    
    if(!cookie){
      throw new Error("Cookies not found")
    }

    await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "test meal",
      description: "test meal description",
      diet: 1,
    }).expect(201)

    const mealUpdate = await request(app.server).put("/meal/1").set("Cookie", cookie).send({
      name: "test update",
    }).expect(200)

    expect(mealUpdate.body.meal[0].name).toEqual("test update")
  })

  test("Delete specific meal", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafael",
      email: "test@gmail.com",
      password: "12345",
    })

    const login = await request(app.server).post("/user/signin").send({
      email: "test@gmail.com",
      password: "12345",
    })

    const cookie = login.get("Set-Cookie")
    
    if(!cookie){
      throw new Error("Cookies not found")
    }

    await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "test meal",
      description: "test meal description",
      diet: 1,
    }).expect(201)

    await request(app.server).delete("/meal/1").set("Cookie", cookie).expect(200)

  })

  test("Get summary with metrics", async () => {
    await request(app.server).post("/user/signup").send({ 
      name: "rafael",
      email: "test@gmail.com",
      password: "12345",
    })

    const login = await request(app.server).post("/user/signin").send({
      email: "test@gmail.com",
      password: "12345",
    })

    const cookie = login.get("Set-Cookie")
    
    if(!cookie){
      throw new Error("Cookies not found")
    }

    await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "test meal",
      description: "test meal description",
      diet: 1,
    }).expect(201)

    await request(app.server).post("/meal").set("Cookie", cookie).send({
      name: "meal test",
      description: "lunch",
      diet: 0,
    }).expect(201)

    const summary = await request(app.server).get("/meal/summary")
      .set("Cookie", cookie).expect(200)

    expect(summary.body.total_meals).toEqual(2)
    expect(summary.body.in_diet).toEqual(1)
    expect(summary.body.out_diet).toEqual(1)
    expect(summary.body.diet_sequence).toEqual(1)
  })
})