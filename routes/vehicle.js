var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
const { status } = require("express/lib/response");
var fs=require("fs");
var dotenv=require("dotenv");

dotenv.config();    //environment naam ka file search krega

const filePath=process.env.FILEPATH;

/* GET users listing. */

router.post("/vehiclesubmit", upload.single("icon"), function (req, res, next) {
  console.log(req.file);
  pool.query(
    "insert into vehicle(categoryid,subcategoryid,companyid,modelid,vendorid,registrationno,color,fueltype,ratings,average,remarks,capacity,status,feature,icon) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.categoryid,
      req.body.subcategoryid,
      req.body.companyid,
      req.body.modelid,
      req.body.vendorid,
      req.body.registrationno,
      req.body.color,
      req.body.fueltype,
      req.body.ratings,
      req.body.average,
      req.body.remarks,
      req.body.capacity,
      req.body.status,
      req.body.feature,
      req.file.filename,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Server error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Vehicle Submitted Successfully" });
      }
    }
  );
});

router.get('/display_all_vehicle', function(req, res, next) {
  pool.query("select * from vehicle",function(error,result){
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
    pool.query("update vehicle set icon=? where vehicleid=?",[req.files[0].filename,req.body.vehicleid],function(error,result){
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
    pool.query("update vehicle set modelid=? where vehicleid=?",[req.body.modelname,req.body.vehicleid],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
            
              res.status(200).json({status:true,message:'Vehicle updated successfully'})
          }
    })
  });

  router.post('/delete_data', function(req, res, next) {
    console.log(req.file)
    pool.query("delete from vehicle where vehicleid=?",[req.body.vehicleid],function(error,result){
      if(error)
          { console.log(error)
              res.status(500).json({status:false,message:'Server error'})
              
          }
          else{
            fs.unlinkSync(`${filePath}/${req.body.oldicon}`)
              res.status(200).json({status:true,message:'Vehicle deleted successfully'})
          }
    })
  });
  
module.exports = router;
