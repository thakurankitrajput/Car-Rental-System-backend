var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
const { status } = require('express/lib/response');
var fs=require("fs");
var dotenv=require("dotenv");

dotenv.config();   

const filePath=process.env.FILEPATH;
/* GET users listing. */
router.post('/whypnpsubmit',upload.single('icon'),function(req,res,next){
    console.log(req.file)
    pool.query("insert into whypnp(image,title,description) values(?,?,?)",[req.file.filename,req.body.title,req.body.description],function(error,result){
      if(error)
        { console.log(error)
            res.status(500).json({status:false,message:'Server error'})
            
        }
        else{
            res.status(200).json({status:true,message:'Whypnp submitted successfully'})
        }
    })
});

  module.exports = router;