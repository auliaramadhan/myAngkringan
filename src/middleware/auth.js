require('dotenv').config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    const jwt_token = req.headers["authorization"].substr(7);
    try {
      const user = jwt.verify(jwt_token, process.env.APP_KEY);
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      res.send({ success: false, msg: "jwt invalid" });
    }

    res.send({ success: false, msg: "must login first" });
  }
}

module.exports = {auth}