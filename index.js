require("dotenv").config();

const express = require("express"),
  cors = require("cors"),
  port = process.env.APP_PORT || 3000,
  bodyParser = require("body-parser"),
  user = require("./src/route/user"),
  restaurant = require("./src/route/restaurant"),
  item = require("./src/route/item"),
  review = require("./src/route/review"),
  multer = require("multer"),
  upload = multer(),
  cart = require("./src/route/cart");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ini dibawah biar bisa pake form data
// app.use(upload.array());

app.use(express.static("public"));

app.use("/user", user);
app.use("/cart", cart);
app.use("/restaurant", restaurant);
app.use("/item", item);
app.use("/review", review);

app.get("/", (req, res) => {
  res.send("helo");
});

app.listen(port, console.log("berjalan di port " + port));
