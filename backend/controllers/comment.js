import Comment from "../models/Comment.js";
import express from "express";
import middleware from "../utils/middleware.js";

const commentRouter = express.Router();

commentRouter.get("/", async (req, res) => {
  try {
    const result = await Comment.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

commentRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const newComment = new Comment({
      message,
      user: user._id,
    });
    const savedComment = await newComment.save();
    user.comments = user.comments.concat(newComment._id);
    await user.save();

    const populatedComment = await savedComment.populate("user", {
      username: 1,
      name: 1,
    });

    res.status(201).json(populatedComment);
  } catch (err) {
    next(err);
  }
});

export default commentRouter;
