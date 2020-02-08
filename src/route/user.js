require("dotenv").config();
const router = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../dbconfig");
const { auth, logout } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");
const nodemailer = require('nodemailer')

router.get("/auth", (req, res) => {
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    const jwt_token = req.headers["authorization"].substr(7);
    try {
      const user = jwt.verify(jwt_token, process.env.APP_KEY);
      res.send({ success: true, user });
      return;
    } catch (err) {
      if (err.message === "jwt expired")
        res.send({ success: false, msg: "jwt token expired login again" });
      else res.send({ success: false, msg: "jwt invalid" });
    }
  } else {
    res.send({ success: false, msg: "must login first" });
  }
});


router.get("/", auth(["admin"]), (req, res) => {
  const sql = "select * from user";
  mysql.execute(sql, [], sqlexec(res, mysql));
});

// bikin profil

router.post("/registrasi", (req, res) => {
  console.log(req.body)
  const { username, password, email } = req.body;
  const enc_pass = bcrypt.hashSync(password);
  const sql = "INSERT INTO user (username,password,email,roles) VALUES(?,?,?,?)";

  try {
    mysql.execute(sql, [username, enc_pass, email, "customer"], sqlexec(res, mysql));
  } catch (error) {
    res.send({ success: false, msg: error });
  }
});

router.post("/createmanager", auth(["admin"]), (req, res) => {
  const { username, password, id_restaurant } = req.body;
  const enc_pass = bcrypt.hashSync(password);
  const sql =
    "INSERT INTO user (username,password,roles,id_restaurant) VALUES(?,?,?,?)";

  try {
    mysql.execute(
      sql,
      [username, enc_pass, "manager", id_restaurant],
      sqlexec(res, mysql)
    );
  } catch (error) {
    res.send({ success: false, msg: error });
  }
});

router.put("/changeuser/:username", auth([]), (req, res) => {
  const { password } = req.body;
  const { username } = req.user;
  const enc_pass = bcrypt.hashSync(password);
  if (req.params.username !== username) {
    res.send({ success: false, msg: "authorization invalid" });
    return;
  }
  const sql = "UPDATE user SET password=? where username=?";

  mysql.execute(sql, [enc_pass, username], sqlexec(res, mysql));
});

router.put("/changeroles/:username", auth(["admin"]), (req, res) => {
  const { roles, id_restaurant } = req.body;
  const { username } = req.params;
  const sql = "UPDATE user SET roles=?, id_restaurant=? WHERE username=?";
  mysql.execute(sql, [roles, id_restaurant, username], sqlexec(res, mysql));
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM user where username=?";
  try {
    mysql.execute(sql, [username], (err, result, field) => {
      if (result.length > 0) {
        if (bcrypt.compareSync(password, result[0].password)) {
          // const auth = JWT.sign({ ...result[0], id: null }, process.env.APP_KEY);
          const auth = JWT.sign(
            { ...result[0], password: null },
            process.env.APP_KEY,
            { expiresIn: "1d" }
          );
          res.send({
            success: true,
            auth
          });
        } else {
          res.send({
            success: false,
            msg: "user or password incorrect"
          });
        }
      } else {
        res.send({
          success: false,
          msg: "user not found"
        });
      }
    });
  } catch (error) {
    res.send({ success: false, msg: error });
  }
});

router.post("/logout", auth([]), logout);

/* FORGOT PASSWORD */
router.post('/forgot_password', (req, res) => {
  var newPassword = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 6; i++) {
    newPassword += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  const { username } = req.body

  try {
    mysql.execute('SELECT email FROM user WHERE username = ? LIMIT 1', [username], (err, result, field) => {
      if (result.length === 0) {
        res.send({
          succes: false,
          msg: 'Username not Found'
        })
      } else {
        password_decode = bcrypt.hashSync(newPassword)
        mysql.execute('UPDATE user SET password = ? WHERE username = ?', [password_decode, username], (err, result2, field) => {
          return
        })
        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: 'haruman.hijau@gmail.com',
            pass: 'harumanmenjadihijau'
          }
        })

        var mailOptions = {
          from: 'haruman.hijau@gmail.com',
          to: result[0].email,
          subject: '<Dont Repply Email>',
          text: 'your new password for username ' + username + ' is ' + newPassword + `\n please immediately change after login`
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            res.send({
              succes: false,
              msg: 'error in database'
            })
            throw err
          } else {
            console.log('Email sent: ' + info.response);
            res.send({
              succes: true,
              msg: 'check your email'
            })
          }
        })

      }
    })
  } catch (error) {
    res.send({ success: false, msg: error });
  }

})


module.exports = router;
