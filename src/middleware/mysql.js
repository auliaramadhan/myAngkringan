function sqlexec(res, mysql) {
  return (err, result, field) => {
    try {
      if (err) {
        console.log(err);
        if (err.code === "ER_DUP_ENTRY")
          res.send({ success: false, msg: "username already exist" });
        else res.send({ success: false, msg: "error in database" });
        mysql.close();
      } else {
        res.send({ success: true, data: result });
        console.log(field);
      }
    } catch (error) {
      console.log(error);
      mysql.close();
    }
  };
}

module.exports = { sqlexec };
