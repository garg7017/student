const StudentDetail = require('../models/StudentDetail');
const StudentAcedemicDetail = require('../models/StudentAcedemicDetail');


const express = require('express');
const router = express.Router();


// router.all('/*', (req, res, next)=>{
//     req.app.locals.layout = 'layout';
//     next();
// });


router.get('/student_listing', (req,res)=>{
    // console.log("abc");
    // req.app.locals.layout = 'layout';
    //get all data from DB
    // StudentDetail.find({}).then(students=>{
        res.render('student_listing', {students:students});
    // })
});

module.exports = router;