import Todo from "../models/Todo.js";
import User from "../models/Users.js";
import app from "../app.js";
import supertest from "supertest";
import bcrypt from 'bcrypt';

const apitest = supertest(app);

const todosInDB = async () => {
    const result = await Todo.find({});
    return  result.map(e => e.toJSON())
}

const usersInDB = async () => {
    const result = await User.find({});
    return result.map(e => e.toJSON());
}

const loginUser = async (username, password) => {
    const response = await apitest.post('/api/login').send({username, password}).expect(200).expect('Content-Type', /application\/json/);
    return response.body;
}

const registerUser = async (username, name, password) => {
    const response = await apitest.post('/api/register').send({username, name, password}).expect(201).expect("Content-Type", /application\/json/);
    return response.body;
}

const createUser = async(username, name, password) => {
    const passHash = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        password: passHash,
        name
    })
    await user.save();
}


export default { usersInDB, todosInDB, loginUser, registerUser, createUser } ;