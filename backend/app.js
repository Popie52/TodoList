import express from "express";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import loginRouter from "./controllers/login.js";
import registerRouter from "./controllers/register.js";
import mongoose from "mongoose";
import middleware from "./utils/middleware.js";
import userRouter from "./controllers/users.js";
import commentRouter from "./controllers/comment.js";
import todoRouter from "./controllers/todo.js";
import testRouter from "./controllers/testing.js";

const app = express();
app.use(express.json());

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("COnnectecd to mongodb"))
  .catch((err) => {
    logger.error(err.message);
    process.exit(1);
  });

app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use(middleware.tokenExtracter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);
app.use("/api/todos", todoRouter);
if(process.env.NODE_ENV === 'test') app.use('/api/test', testRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
