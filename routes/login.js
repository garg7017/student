const StudentDetail = require('../models/StudentDetail');

const express = require('express');
const router = express.Router();
const app = express();



router.get('/login',(req,res,next)=>{
   console.log("hhhh");
    res.render('login',{layout:'login'});
});










module.exports = router;
