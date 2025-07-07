import express from "express";
const todoRouter = express.Router();
import Todo from "../models/Todo.js";
import middleware from "../utils/middleware.js";

todoRouter.get("/", async (req, res) => {
  const result = await Todo.find({});
  res.json(result);
});

todoRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const user = req.user;
    const newTodo = new Todo({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      completed: completed ?? false,
      user: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedTodo = await newTodo.save();
    user.todos = user.todos.concat(savedTodo._id);
    await user.save();
    const populatedTodo = await savedTodo.populate("user", {
      username: 1,
      name: 1,
    });
    res.status(201).json(populatedTodo);
  } catch (error) {
    next(error);
  }
});

todoRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    const user = req.user;
    const details = req.body;
    const todo = await Todo.findById(id).populate("user", {
      username: 1,
      name: 1,
    });
    if (!todo) {
      return res.status(404).json({ error: "todo not found" });
    }
    if (user._id.toString() != todo.user._id.toString()) {
      return res.status(403).json({ error: "unauthorized: not your todo"});
    }

    Object.assign(todo, details, { updatedAt: new Date() });
    const updated = await todo.save();

    res.status(200).json(updated);

  } catch (error) {
    next(error);
  }
});


todoRouter.delete("/:id", middleware.userExtractor,async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = req.user;
        const todo = await Todo.findById(id).populate("user", {username: 1, name: 1});
        if(!todo) {
            return res.status(404).json({error: "todo not found"});
        }
        if(todo.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({error: "unauthorized: not your todo"})
        }
        await todo.deleteOne();
        user.todos = user.todos.filter(to => to._id.toString() !== todo._id.toString());
        await user.save();

        res.status(204).end();
    } catch (error) {
        next(error);
    }
} )


export default todoRouter;
