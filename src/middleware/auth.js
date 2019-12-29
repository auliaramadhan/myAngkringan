require("dotenv").config();
const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_PORT);

function auth(roles) {
  return (req, res, next) => {
    if (
      req.headers["authorization"] &&
      req.headers["authorization"].startsWith("Bearer")
    ) {
      const jwt_token = req.headers["authorization"].substr(7);
      client.sismember("revokedToken", jwt_token, (err, reply) => {
        if (reply) {
          res.send({ success: false, msg: "must login first" });
          return;
        }
        try  {
          const user = jwt.verify(jwt_token, process.env.APP_KEY);
          if (!roles.includes(user.roles) && roles.length !== 0) {
            res.send({ success: false, msg: "access denied" });
            return;
          }
          req.user = user;
          next();
        } catch (err) {
          console.log(err);
          if (err.message === 'jwt expired') res.send({ success: false, msg: "jwt token expired" });
          else res.send({ success: false, msg: "jwt invalid" });
        }
      });
    } else {
      res.send({ success: false, msg: "must login first" });
    }
  };
}

function logout(req, res, next) {
  const jwt_token = req.headers["authorization"].substr(7);
  client.sadd("revokedToken", jwt_token);
  res.send({ success: true, msg: "logout success" });
}

function setallowed(params) {
  return (req, res, next) => {
    if (req.user.roles !== param) {
      res.send({ success: false, msg: "access denied" });
      // fs.unlink(image, err => {
      //   if (err) throw err;
      //   console.log("successfully deleted " + image);
      // });
      // return;
    } else next();
  };
}

module.exports = { auth, logout };
