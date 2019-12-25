require("dotenv").config();

const mysql = require("mysql2");

const { DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const myconn = mysql.createConnection({
  host: DB_SERVER,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE
});

module.exports = myconn;
