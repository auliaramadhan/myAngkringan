require('dotenv').config();
const router = require('express').Router()
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const mysql = require('../dbconfig')
const {auth} = require('../middleware/auth')
const {sqlexec} = require('../middleware/mysql');



router.post('/registrasi', (req,res) =>{
   const {username, password} = req.body

   const enc_pass = bcrypt.hashSync(password)

   const sql = "INSERT INTO user (username,password) VALUES(?,?)"

   mysql.execute(sql,[username, enc_pass], sqlexec)

})

router.post('/createmanager',auth,(req,res) =>{

   if (req.user.roles !== 'admin') {
      res.send({success:false, msg:'authorization invalid'})
      return ;
   }
   const {username, password, id_restaurant} = req.body

   const enc_pass = bcrypt.hashSync(password)

   const sql = "INSERT INTO user (username,password,roles,id_restaurant) VALUES(?,?,?,?)"

   mysql.execute(sql,[username, enc_pass,"manager", id_restaurant ],sqlexec)

})

router.put('/changeuser/:username', auth, (req, res) => {
   const {password} = req.body
   // const {username} = req.params
   const {username} = req.user
   const sql = 'UPDATE user SET password=? where username=?'

   mysql.execute(sql, [password, username], sqlexec)
})

router.put('/changeroles/:username', auth, (req, res) => {
if (req.user.roles !== "admin") {
   res.send({success:false, msg:'authorization invalid'})
   return;
}
   const { roles} = req.body
    // const {username} = req.params
    const {username} = req.user
   const sql = 'UPDATE user SET roles=? WHERE username=?'
   mysql.execute(sql, [roles, username], (err, result,field) =>{
      if (err) console.log(err)
      res.send(field)
   })
})

router.post('/login', (req,res) => {
   const {username, password} = req.body
   const sql = 'SELECT * FROM user where username=?'
   mysql.execute(sql, [username], (err, result, field)=>{
      console.log(result)
      if (result.length>0) {
        if(bcrypt.compareSync(password, result[0].password))
        {
           const auth = JWT.sign({...result[0], id:null}, process.env.APP_KEY)
           res.send({
              success: true,
              auth
           })
        }else{
         res.send({
            success:false, msg:"user or password incorrect"
         })
        }
      }
      else{
         res.send({
            success:false, msg:"user not found"
         })
      }
   })

})

// router.get('/:id',auth, (req,res)=>{
//    const {id} = req.params
//    const sql = 'SELECT * FROM user where id=?'
//    mysql.execute(sql,[id],(err, result, field) => {
//       res.send(result)
//    })
// })

module.exports = router
