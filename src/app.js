const Middleware = require("./utils/middleware");
const { PUBLIC } = require("./utils/config");
const verificationRouter = require("./verification/routes");
const categoryRouter = require("./category/routes");
const advertisementRouter = require("./advertisement/routes");
const userRouter = require("./user/routes");
const authRouter = require("./auth/routes");
const storeRouter = require("./store/routes");
const chatRouter = require("./chat/routes");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(PUBLIC));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/advertisement", advertisementRouter);
app.use("/api/store", storeRouter);
app.use("/api/chat", chatRouter);

app.use(Middleware.errorHandler);

module.exports = app;
