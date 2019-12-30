function sqlexec(res, mysql) {
  return (err, result, field) => {
    try {
      if (err) {
        if (err.code === "ER_DUP_ENTRY")
          res.send({ success: false, msg: "username already exist" });
        else res.send({ success: false, msg: "error in database" });
        return;
      } else {
        res.send({ success: true, data: result});
      }
    } catch (error) {     
      return;
    }
  };
}

function sqlexecData(res, mysql, data_page) {
  return (err, result, field) => {
    try {
      if (err) {
       
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
          res.send({ success: true, data: result, page:data_page});
        }else  res.send({ success: true, data: []})
      }
    } catch (error) {
     
      return;
    }
  };
}


module.exports = { sqlexec , sqlexecData};
