import { test, describe, beforeEach, after } from "node:test";
import Todo from "../models/Todo.js";
import User from "../models/Users.js";
import assert from "node:assert";
import app from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import helper from "./helper.js";

import supertest from "supertest";

const api = supertest(app);

let token = null;
let token2 = null;

beforeEach(async () => {
  await api.post("/api/test").expect(204);
});

describe("Registering User", () => {
  test("creating a user", async () => {
    const usersAtStart = await helper.usersInDB();

    const response = await helper.registerUser("loki", "jacob", "kali4u");

    const usersAtEnd = await helper.usersInDB();

    assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length);
    assert.strictEqual(response.name, "jacob");
  });
});

describe("login functionality", () => {
  beforeEach(async () => {
    await helper.createUser("loki", "jacob", "kali4u");
  });

  test("login user", async () => {
    const result = await helper.loginUser("loki", "kali4u");

    assert.strictEqual(result.name, "jacob");
  });
});

describe("Todos CRUD Operations", () => {
  test("get all todos", async () => {
    const todosAtStart = await helper.todosInDB();
    const result = await api
      .get("/api/todos")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.length, todosAtStart.length);
  });

  beforeEach(async () => {
    const response = await helper.registerUser("loki", "jacob", "kali4u");
    token = response.token;

    const response2 = await helper.registerUser("loki2", "jacob2", "kali4u");
    token2 = response2.token;
  });

  test("create a todo", async () => {
    const data = {
      title: "Complete the unit testing for backend",
      description: "Trying test driven development",
      completed: false,
      dueDate: "2025-07-10T18:00:00.000Z",
      priority: "high",
    };
    const todosAtStart = await helper.todosInDB();
    const response = await api
      .post("/api/todos")
      .send(data)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      response.body.title,
      "Complete the unit testing for backend"
    );

    const todosAtEnd = await helper.todosInDB();
    assert.strictEqual(todosAtEnd.length, todosAtStart.length + 1);
  });

  describe("updation and deletion", () => {
    let id;
    beforeEach(async () => {
      const data = {
        title: "Complete the unit testing for backend",
        description: "Trying test driven development",
        completed: false,
        dueDate: "2025-07-10T18:00:00.000Z",
        priority: "high",
      };
      const response = await api
        .post("/api/todos")
        .send(data)
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect("Content-Type", /application\/json/);
      id = response.body.id;
    });

    test("reject unauthorized access for updation", async () => {
      const data = {
        title: "Complete the unit testing for backend",
        description: "Trying test driven development",
        completed: true,
        dueDate: "2025-07-10T18:00:00.000Z",
        priority: "high",
      };

      const todosAtStart = await helper.todosInDB();
      assert.strictEqual(todosAtStart[0].completed, false);

      const response = await api
        .put(`/api/todos/${id}`)
        .send(data)
        .set({ Authorization: `Bearer ${token2}` })
        .expect(403)
        .expect("Content-Type", /application\/json/);
      const todosAtEnd = await helper.todosInDB();

      assert.strictEqual(response.body.error, "unauthorized: not your todo");
      assert.strictEqual(todosAtEnd[0].completed, false);

      assert.strictEqual(todosAtStart.length, todosAtEnd.length);
    });

    test("update a todo", async () => {
      const data = {
        title: "Complete the unit testing for backend",
        description: "Trying test driven development",
        completed: true,
        dueDate: "2025-07-10T18:00:00.000Z",
        priority: "high",
      };

      const todosAtStart = await helper.todosInDB();
      assert.strictEqual(todosAtStart[0].completed, false);

      const response = await api
        .put(`/api/todos/${id}`)
        .send(data)
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .expect("Content-Type", /application\/json/);
      const todosAtEnd = await helper.todosInDB();

      assert.strictEqual(response.body.completed, true);
      assert.strictEqual(todosAtEnd[0].completed, true);

      assert.strictEqual(todosAtStart.length, todosAtEnd.length);
    });

    test("delete a todo", async () => {
      const todosAtStart = await helper.todosInDB();
      assert.strictEqual(todosAtStart.length, 1);

      await api
        .delete(`/api/todos/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(204);
      const todosAtEnd = await helper.todosInDB();

      assert.strictEqual(todosAtStart.length - 1, todosAtEnd.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
