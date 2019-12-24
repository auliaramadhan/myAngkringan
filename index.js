const express = require("express"),
  cors = require("cors"),
  port = process.env.PORT || 3000
  bodyParser = require("body-parser");

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'))

app.listen(port, console.log('berjalan di port ' + port))




