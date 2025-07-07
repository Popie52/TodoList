import express from "express";
import bcrypt from 'bcrypt';
import User from "../models/Users.js";
import jwt from 'jsonwebtoken';
import config from "../utils/config.js";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "missing username or password" });
    }
    const user = await User.findOne({username});
    const passwordHash = user !==null ? await bcrypt.compare(password, user.password):false;
    if(!(user && passwordHash)) {
        return res.status(401).json({error: "user or password invalid"})
    }

    const userForToken = {
        username: user.username,
        id: user._id 
    }

    const token = jwt.sign(userForToken, config.SECRET_KEY, {expiresIn: "1d"});

    res.status(200).json({token, username: user.username, name: user.name});
  } catch (error) {
    next(error);
  }
});

export default loginRouter;
