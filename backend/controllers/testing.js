import Todo from "../models/Todo.js";
import User from "../models/Users.js";

import express from "express";

const testRouter = express.Router();

testRouter.post("/", async (req, res) => {
  await Todo.deleteMany({});
  await User.deleteMany({});
  res.status(204).end();
});

export default testRouter;
