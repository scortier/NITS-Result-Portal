const express = require("express");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const connectDB = require("./connect");

require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 5000;

const routes = require("./routes");

// for parsing body
app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(compression());

app.use(
  session({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

// router setup
app.use("/", routes);

// Database Connection and server listen...
connectDB();

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
