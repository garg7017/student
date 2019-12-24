const StudentDetail = require('../models/StudentDetail');
const StudentAcedemicDetail = require('../models/StudentAcedemicDetail');


const express = require('express');
const router = express.Router();

/**
 * Check user login
 */
function checkAuthantication(req){
    // let authorize = false;
    // user_session = req.session;
    // console.log(user_session.email);
    // if(user_session.email){
        return true;
    // } else {
    //     return false;
    // }
}

router.get('/', (req,res)=>{
    authorize = checkAuthantication(req);
    req.app.locals.layout = 'layout';
    //get all data from DB
    //get count of students
    if(authorize){
        let total_students = 0;
        StudentDetail.countDocuments({}).then(total=>{
            total_students = total;
        })

        var page = 1;

        StudentDetail.find({}).limit(2).then(students=>{
            res.render('student_listing', {students:students,total_students:total_students,page_no:page});
        })
    } else {
        res.redirect('login');
    }
});


//Student Listing: pagination

router.get('/:page', async (req, res, next) => {
    
    const resPerPage = 2; // results per page
    const page = req.params.page || 1; // Page 

    let total_students = 0;
    StudentDetail.countDocuments({}).then(total=>{
        total_students = total;
    })
    
    StudentDetail.find({}).skip((page * resPerPage) - resPerPage).limit(resPerPage).then(students=>{
        res.render('student_listing', {layout: 'edit_layout',students:students,total_students:total_students,page_no:page});
    })

})



module.exports = router;