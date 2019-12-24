require('dotenv').config();
const router = require('express').Router()
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const mysql = require('../dbconfig')
const {auth} = require('../middleware')


router.post('/', auth, (req,res) =>{
   const {username, password} = req.body

   const enc_pass = bcrypt.hashSync(password)

   const sql = "INSERT INTO user (username,password) VALUES(?,?)"

   mysql.execute(sql,[username, enc_pass], (err, result, field)=>{
      res.send(result)
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
           const auth = JWT.sign({username}, process.env.APP_KEY)
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

router.get('/:id',auth, (req,res)=>{
   const {id} = req.params
   const sql = 'SELECT * FROM user where id=?'
   mysql.execute(sql,[id],(err, result, field) => {
      res.send(result)
   })
})

module.exports = router
