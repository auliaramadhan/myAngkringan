require("dotenv").config();
const router = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../dbconfig");
const { auth , logout} = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");


router.get('/', auth(['admin']), (req, res) =>{
  const sql = "select * from user";
  mysql.execute(sql, [], sqlexec(res, mysql));
})

router.post("/registrasi",(req, res) => {
  const { username, password } = req.body;
  const enc_pass = bcrypt.hashSync(password);
  const sql = "INSERT INTO user (username,password,roles) VALUES(?,?,?)";

  mysql.execute(sql, [username, enc_pass, 'customer'], sqlexec(res, mysql));
});

router.post("/createmanager", auth(['admin']), (req, res) => {
  const { username, password, id_restaurant } = req.body;
  const enc_pass = bcrypt.hashSync(password);
  const sql =
    "INSERT INTO user (username,password,roles,id_restaurant) VALUES(?,?,?,?)";

  mysql.execute(
    sql,
    [username, enc_pass, "manager", id_restaurant],
    sqlexec(res, mysql)
  );
});


router.put("/changeuser/:username", auth([]) , (req, res) => {
  const { password } = req.body;
  const { username } = req.user;
  const enc_pass = bcrypt.hashSync(password);
  if (req.params.username !== username){
    res.send({ success: false, msg: "authorization invalid" });
    return;
  }
  const sql = "UPDATE user SET password=? where username=?";

  mysql.execute(sql, [enc_pass, username], sqlexec(res, mysql));
});

router.put("/changeroles/:username", auth(['admin']), (req, res) => {
  const { roles, id_restaurant } = req.body;
  const {username} = req.params;
  const sql = "UPDATE user SET roles=?, id_restaurant=? WHERE username=?";
  mysql.execute(sql, [roles, id_restaurant, username], sqlexec(res, mysql));
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
 
  const sql = "SELECT * FROM user where username=?";
  mysql.execute(sql, [username], (err, result, field) => {
   
    if (result.length > 0) {
      if (bcrypt.compareSync(password, result[0].password)) {
        // const auth = JWT.sign({ ...result[0], id: null }, process.env.APP_KEY);
        const auth = JWT.sign({ ...result[0] }, process.env.APP_KEY, {expiresIn:'1h'});
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
});

router.post("/logout",auth([]),logout)

module.exports = router;
