import User from "../models/Users.js";
import config from "./config.js";
import logger from "./logger.js";
import jwt from 'jsonwebtoken';

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  }

  next(error);
};

const tokenExtracter = (request, res, next) => {
    const authorization = request.get('authorization');
    if(authorization && authorization.startsWith('Bearer')) {
        request.token =  authorization.replace('Bearer ', '');
    } else request.token = null;
    next();
}

const userExtractor = async (req, res, next) => {
    const token = req.token;
    try {
        if(!token) {
            return res.status(401).json({error: "token missing"});
        }

        // verify token
        const decodedToken = jwt.verify(token ,config.SECRET_KEY);
        if(!decodedToken.id){
            return res.status(401).json({error: "token invalid"});
        }

        const user = await User.findById(decodedToken.id);
        if(!user) {
            return res.status(404).json({error: "user not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
}

export default { errorHandler, unknownEndpoint, tokenExtracter, userExtractor };
