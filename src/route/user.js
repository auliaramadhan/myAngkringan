require('dotenv').config();
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {auth} = require('../middleware/auth')
const {login, registrasi} = require('../model/user');
const mysql = require("../dbconfig");

router.post('/login', auth, (req,res) => {
   const {username, password} = req.body
   res.send(login(...req.body))
})

router.post('/registrasi', (req,res) =>{
   const {username, password} = req.body

   const enc_pass = bcrypt.hashSync(password)

   const query = registrasi(username,enc_pass)
   mysql.execute( ...query ,(err, result, field) => {
      // console.log(err)
      res.send(result)
  });
})


// router.get('/:id',auth, (req,res)=>{
//    const {id} = req.params
//    const sql = 'SELECT * FROM user where id=?'
//    mysql.execute(sql,[id],(err, result, field) => {
//       res.send(result)
//    })
// })

module.exports = router
