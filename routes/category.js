var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
const { status } = require('express/lib/response');
var fs=require('fs')
var dotenv=require("dotenv");

dotenv.config();  

const filePath=process.env.FILEPATH;
/* GET users listing. */
router.post('/categorysubmit',upload.single('icon'), function(req, res, next) {
  console.log(req.file)
  pool.query("insert into category(categoryname,icon) values(?,?)",[req.body.categoryname,req.file.filename],function(error,result){
    if(error)
        { console.log(error)
            res.status(500).json({status:false,message:'Server error'})
            
        }
        else{
            res.status(200).json({status:true,message:'Category Submitted Successfully'})
        }
  })
});

router.post('/edit_picture',upload.any(), function(req, res, next) {
    console.log(req.file)
    pool.query("update category set icon=? where categoryid=?",[req.files[0].filename,req.body.categoryid],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
            fs.unlinkSync(`${filePath}/${req.body.oldicon}`)
              res.status(200).json({status:true,message:'Icon updated successfully'})
          }
    })
  });

  router.post('/edit_data', function(req, res, next) {
    console.log(req.file)
    pool.query("update category set categoryname=? where categoryid=?",[req.body.categoryname,req.body.categoryid],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
            
              res.status(200).json({status:true,message:'Category updated successfully'})
          }
    })
  });

  router.post('/delete_data', function(req, res, next) {
    console.log(req.file)
    pool.query("delete from category where categoryid=?",[req.body.categoryid],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
            fs.unlinkSync(`${filePath}/${req.body.oldicon}`)
              res.status(200).json({status:true,message:'Category deleted successfully'})
          }
    })
  });
  


router.get('/display_all_category', function(req, res, next) {
pool.query("select * from category",function(error,result){
    if(error)
        {
            res.status(500).json({status:false,message:'Server Error'})
        }
        else{
           res.status(200).json({status:true,data:result})
        }
        
})
})

module.exports = router;
