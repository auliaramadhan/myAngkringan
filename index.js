require("dotenv").config();

const express = require("express"),
  cors = require("cors"),
  port = process.env.APP_PORT || 3000,
  bodyParser = require("body-parser"),
  user = require("./src/route/user");

const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// ini dibawah biar bisa pake form data
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static("public"));

app.use("/user", user);

app.get('/',(req,res)=>{
   res.send('helo')
})

app.listen(port, console.log("berjalan di port " + port));
