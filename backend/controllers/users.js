import User from '../models/Users.js';
import Comment from '../models/Comment.js';
import express from 'express';
const userRouter = express.Router();


userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate('comments', {message: 1});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default userRouter;