"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var swaggerJSDoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var multer = require("multer");
var api = require("./src/route");
require("dotenv").config();
var port = process.env.APP_PORT || 3000, upload = multer();
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0'
        }
    },
    // Path to the API docs
    apis: [
        './src/route/item.js',
        './src/route/cart.js',
    ]
};
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ini dibawah biar bisa pake form data
// app.use(upload.array());
app.use(express.static(__dirname + "/public"));
app.use('/api', api);
app.get("/", function (req, res) {
    res.send("helo");
});
app.listen(port, function () { return console.log('berjalan di port ' + port); });
