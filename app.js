const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
dotenv.config({ path: "./config.env" });

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

// body parser input limit
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

module.exports = app;
