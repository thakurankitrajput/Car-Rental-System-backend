var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require("fs");
var dotenv=require("dotenv");

dotenv.config();    //environment naam ka file search krega

const filePath=process.env.FILEPATH;   //process.env  FILEPATH naam ka variable uthayga or filePath me set krdega.
/* GET users listing. */

router.post('/fetch_all_subcategory_by_category',function(req,res){
  pool.query("select S.*,(select C.categoryname from category C where C.categoryid=S.categoryid) as categoryname from subcategory S where S.categoryid=?",[req.body.categoryid],function(error,result){
    if(error)
      { console.log(error)
          res.status(500).json({status:false,message:'Server error',result:[]})
          
      }
      else{
          res.status(200).json({status:true,result:result})
      }
  })
})


router.post('/subcategorysubmit',upload.single('icon'), function(req, res, next) {
  console.log(req.body.files)
  pool.query("insert into subcategory(categoryid,subcategoryname,icon,priority) values(?,?,?,?)",[req.body.categoryid,req.body.subcategoryname,req.file.filename,req.body.priority],function(error,result){
    if(error)
        { console.log(error)
            res.status(500).json({status:false,message:'Server error'})
            
        }
        else{
            res.status(200).json({status:true,message:'SubCategory Submitted Successfully'})
        }
  })
});

router.get('/display_all_subcategory', function(req, res, next) {
  pool.query("select * from subcategory",function(error,result){
      if(error)
          {
              res.status(500).json({status:false,message:'Server Error'})
          }
          else{
             res.status(200).json({status:true,data:result})
          }
          
  })
  })

  router.post('/edit_picture',upload.any(), function(req, res, next) {
    console.log(req.file)
    pool.query("update subcategory set icon=? where subcategoryid=?",[req.files[0].filename,req.body.subcategoryid],function(error,result){
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
    pool.query("update subcategory set subcategoryname=? where subcategoryid=?",[req.body.subcategoryname,req.body.subcategoryid],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
            
              res.status(200).json({status:true,message:'SubCategory updated successfully'})
          }
    })
  });

  router.post('/delete_data', function(req, res, next) {
    console.log(req.file)
    pool.query("delete from subcategory where subcategoryid=?",[req.body.subcategoryid],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
            fs.unlinkSync(`${filePath}/${req.body.oldicon}`)
              res.status(200).json({status:true,message:'SubCategory deleted successfully'})
          }
    })
  });
  
module.exports = router;

