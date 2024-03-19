const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: ["*"], credentials: true }));

mongoose.set("strictQuery", true);
mongoose
  .connect('mongodb+srv://post:post012@post.rljc0cs.mongodb.net/')
  .then(() => console.log("DB Work 😍"))
  .catch((err) => console.log(`Error ${err.message}`));

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(5000, () => console.log("Server Running 🥰"));
