require("dotenv").config();

const express = require("express"),
  cors = require("cors"),
  port = process.env.APP_PORT || 3000,
  bodyParser = require("body-parser"),
  user = require("./src/route/user"),
  restaurant = require("./src/route/restaurant"),
  item = require("./src/route/item"),
  review = require("./src/route/review"),
  category = require("./src/route/category"),
  profile = require("./src/route/profile"),
  checkout = require("./src/route/checkout"),
  multer = require("multer"),
  upload = multer(),
  cart = require("./src/route/cart");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ini dibawah biar bisa pake form data
// app.use(upload.array());

app.use(express.static(__dirname+"/public"));



app.use("/user", user);
app.use("/cart", cart);
app.use("/restaurant", restaurant);
app.use("/item", item);
app.use("/review", review);
app.use("/category", category);
app.use("/profile", profile);
app.use("/checkout",checkout);

app.get("/", (req, res) => {
  res.send("helo");
});

app.listen(port, console.log('berjalan di port '+port));