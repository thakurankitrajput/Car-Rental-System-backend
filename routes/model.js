var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require("fs");
var dotenv=require("dotenv");

dotenv.config();    //environment naam ka file search krega

const filePath=process.env.FILEPATH;   //process.env  FILEPATH naam ka variable uthayga or filePath me set krdega.
/* GET users listing. */

router.post('/fetch_all_model_by_company',function(req,res){
  pool.query("select M.*,(SELECT C.companyname FROM company C WHERE M.companyid = C.companyid) AS companyname from Model as M where M.companyid=?",[req.body.companyid],function(error,result){
    if(error)
      { console.log(error)
          res.status(500).json({status:false,message:'Server error',result:[]})
          
      }
      else{
          res.status(200).json({status:true,results1:result})
      }
  })
})

router.post('/modelsubmit',upload.single('icon'), function(req, res, next) {
    console.log(req.file)
    pool.query("insert into model(categoryid,subcategoryid,companyid,modelname,year,icon) values(?,?,?,?,?,?)",[req.body.categoryid,req.body.subcategoryid,req.body.companyid,req.body.modelname,req.body.year,req.file.filename],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
              res.status(200).json({status:true,message:'Category Submitted Successfully'})
          }
    })
  });

  router.get('/display_all_model', function(req, res, next) {
    pool.query("select M.*,(select C.categoryname from category C where C.categoryid=M.categoryid)as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=M.subcategoryid)as subcategoryname,(select C.companyname from company C where C.companyid=M.modelid)as companyname from model M",function(error,result){
        if(error)
            {
                res.status(500).json({status:false,message:'Server Error'})
            }
            else{
               res.status(200).json({status:true,data:result})
            }
            
    })
    });
  

    router.post('/edit_picture',upload.any(), function(req, res, next) {
      console.log(req.file)
      pool.query("update model set icon=? where modelid=?",[req.files[0].filename,req.body.modelid],function(error,result){
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
      pool.query("update model set modelname=? where modelid=?",[req.body.modelname,req.body.modelid],function(error,result){
        if(error)
            { console.log(error)
                res.status(500).json({status:false,message:'Server error'})
                
            }
            else{
              
                res.status(200).json({status:true,message:'Model updated successfully'})
            }
      })
    });
  
    router.post('/delete_data', function(req, res, next) {
      console.log(req.file)
      pool.query("delete from model where modelid=?",[req.body.modelid],function(error,result){
        if(error)
            { console.log(error)
                res.status(500).json({status:false,message:'Server error'})
                
            }
            else{
              fs.unlinkSync(`${filePath}/${req.body.oldicon}`)
                res.status(200).json({status:true,message:'Model deleted successfully'})
            }
      })
    });
    
module.exports = router;