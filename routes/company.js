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

router.post('/fetch_all_company_by_subcategory',function(req,res){
  pool.query("select C.*,(SELECT S.subcategoryname FROM subcategory S WHERE S.subcategoryid = C.subcategoryid) AS subcategoryname from company as C where C.subcategoryid=?",[req.body.subcategoryid],function(error,result){
    if(error)
      { console.log(error)
          res.status(500).json({status:false,message:'Server error',result:[]})
          
      }
      else{
          res.status(200).json({status:true,results:result})
      }
  })
})

router.post('/companysubmit',upload.single('icon'), function(req, res, next) {
  console.log(req.file)
  pool.query("insert into company(categoryid,subcategoryid,companyname,icon) values(?,?,?,?)",[req.body.categoryid,req.body.subcategoryid,req.body.companyname,req.file.filename],function(error,result){
    if(error)
        { console.log(error)
            res.status(500).json({status:false,message:'Server error'})
            
        }
        else{
            res.status(200).json({status:true,message:'Company Submitted Successfully'})
        }
  })
});

router.get('/display_all_company', function(req, res, next) {
  pool.query("select CM.*,(select C.categoryname from category C where C.categoryid=CM.categoryid)as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=CM.subcategoryid)as subcategoryname from company CM",function(error,result){
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
    pool.query("update company set icon=? where companyid=?",[req.files[0].filename,req.body.companyid],function(error,result){
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
    pool.query("update company set companyname=? where companyid=?",[req.body.companyname,req.body.companyid],function(error,result){
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
    pool.query("delete from company where companyid=?",[req.body.companyid],function(error,result){
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