function sqlexec(err, result, field) {
   if (err) {
      console.log(err)
   }else{
   res.send(field);
   }
 }

module.exports = {sqlexec}