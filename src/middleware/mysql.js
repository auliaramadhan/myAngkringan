function sqlexec(res, mysql) {
  return (err, result, field) => {
    try {
      if (err) {
        if (err.code === "ER_DUP_ENTRY")
          res.send({ success: false, msg: "username already exist" });
        else res.send({ success: false, msg: "error in database" });
        console.log(err)
        return;
      } else {
        if (result.affectedRows===0) {
          res.send({ success:false , data: result});
        }else  res.send({ success:true , data: result});
      }
    } catch (error) {   
      res.status(400)
      return res.send({ success: false, error}) ;
    }
  };
}

function sqlexecData(res, mysql, data_page) {
  return (err, result, field) => {
    try {
      if (err) {
        console.log(err)
        if (err.code === 'ER_BAD_FIELD_ERROR')res.send({ success: false, msg: "query false" });
        else res.send({ success: false, msg: "error in database" });
        return ;
      } else {
        if (!data_page) {
          res.send({ success: true, data: result.slice(0,1), showcase:result.slice(1)});
        }else if( result.length>1 ) {
          data_page.total_data = result.pop().id;
          data_page.total_page = 
          Math.ceil(data_page.total_data/data_page.limit);
          res.send({ success: true, data: result, page:data_page, query:data_page.query});
        }else  res.send({ success: false, data: []})
      }
    } catch (error) {
      res.status(400)
      return res.send({ success: false, error}) ;
    }
  };
}


module.exports = { sqlexec , sqlexecData};
