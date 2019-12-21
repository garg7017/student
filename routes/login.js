const StudentDetail = require('../models/StudentDetail');

const express = require('express');
const router = express.Router();

router.get('/login',(req,res)=>{
    res.render('login');
})







module.exports = router;