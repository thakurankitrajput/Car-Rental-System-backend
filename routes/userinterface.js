var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
const { status } = require("express/lib/response");
var fs=require("fs");
var dotenv=require("dotenv");

dotenv.config();    //environment naam ka file search krega

const filePath=process.env.FILEPATH;

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
    });

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
      });
    
      router.get('/display_all_cities', function(req, res, next) {
        pool.query("select * from cities",function(error,result){
            if(error)
                {
                    res.status(500).json({status:false,message:'Server Error'})
                }
                else{
                   res.status(200).json({status:true,data:result})
                }
                
        })
        });

        router.get('/all_features', function(req, res, next) {
            pool.query("select * from featured",function(error,result){
                if(error)
                    {
                        res.status(500).json({status:false,message:'Server Error'})
                    }
                    else{
                       res.status(200).json({status:true,data:result})
                    }
                    
            })
            });
        
            router.get('/all_offers', function(req, res, next) {
                pool.query("select * from offers",function(error,result){
                    if(error)
                        {
                            res.status(500).json({status:false,message:'Server Error'})
                        }
                        else{
                           res.status(200).json({status:true,data:result})
                        }
                        
                })
                });
      
                router.get('/all_whypnp', function(req, res, next) {
                    pool.query("select * from whypnp",function(error,result){
                        if(error)
                            {
                                res.status(500).json({status:false,message:'Server Error'})
                            }
                            else{
                               res.status(200).json({status:true,data:result})
                            }
                            
                    })
                    });
          
                    router.get('/display_all_vehicle', function(req, res, next) {
                        pool.query("Select V.*,(select C.categoryname from category C where C.categoryid=V.categoryid) as categoryname, (select S.subcategoryname from subcategory S where S.subcategoryid=V.subcategoryid) as subcategoryname, (select CM.companyname from company CM where CM.companyid=V.companyid) as companyname, (select M.modelname from model M where M.modelid=V.modelid) as modelname from vehicle V",function(error,result){
                            if(error)
                                {
                                    res.status(500).json({status:false,message:'Server Error'})
                                }
                                else{
                                   res.status(200).json({status:true,data:result})
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

                                router.get('/display_all_vehicle_searching', function(req, res, next) {
                                    pool.query("Select V.*,(select C.categoryname from category C where C.categoryid=V.categoryid) as categoryname, (select S.subcategoryname from subcategory S where S.subcategoryid=V.subcategoryid) as subcategoryname, (select CM.companyname from company CM where CM.companyid=V.companyid) as companyname, (select M.modelname from model M where M.modelid=V.modelid) as modelname from vehicle V where V.companyid in(select C.companyid from company C where C.companyid in(?))",[req.body.companyid],function(error,result){
                                        if(error)
                                            {
                                                res.status(500).json({status:false,message:'Server Error'})
                                            }
                                            else{
                                               res.status(200).json({status:true,data:result})
                                            }
                                            
                                    })
                                    });
            
module.exports = router;
    