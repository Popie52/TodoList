import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/Users.js";
import config from "../utils/config.js";

const registerRouter = express.Router();

registerRouter.post("/", async(req, res, next) => {
    const saltRounds = 10;
    try {
        const {username, name, password} = req.body;
        if(!username || !name || !password) {
            return res.status(400).json({error: "Missing username or name or password"});
        }

        const existingUser = await User.findOne({username});
        if(existingUser) {
            return res.status(409).json({error: "username already exists"});
        }

        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            username,
            name,
            password: passwordHash
        })
        
        const savedUser = await newUser.save();
            const userForToken = {
                username: savedUser.username,
                id: savedUser.id
            }
            const token = jwt.sign(userForToken, config.SECRET_KEY, {expiresIn: "1d"});
            const newToken = {token, username: savedUser.username, name: savedUser.name};
            res.status(201).json(newToken);
    } catch (error) {
        next(error);
    }
})

export default registerRouter;
