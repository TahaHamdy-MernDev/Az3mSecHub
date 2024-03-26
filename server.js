const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

dotenv.config();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Also increase for URL-encoded bodies
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb+srv://post:post012@post.rljc0cs.mongodb.net/")
  .then(() => console.log("DB Work 😍"))
  .catch((err) => console.log(`Error ${err.message}`));

app.use("/server-app/api/auth", authRoute);
app.use("/server-app/api/post", postRoute);
app.get("/server-app", (req, res) => {
  res.send("this is Main Route");
});

app.use("*", (req, res) => {
  res.json({ message: "This Route not found", url: req });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred." });
});
app.listen(5000, () => console.log("Server Running 🥰"));