var express = require('express');
var router = express.Router();
var pool=require('./pool')

/* GET home page. */
router.post('/check_admin_login', function(req, res, next) {
  pool.query("select * from administrator where (emailid=? or mobileno=?)and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){

    if(error)
    {
        res.status(500).json({status:false,message:'Server Error'});
    }
    else
    {
        if(result.length==1)
            res.status(200).json({status:true});
        else
        res.status(200).json({status:false,message:'Invalid Emailid/Monile no/Password'});
    }
  })
  
  
    
});

module.exports = router;
