const StudentDetail = require('../models/StudentDetail');

const express = require('express');
const router = express.Router();
const app = express();
const Strategy = require('passport').Strategy;



router.get('/',(req,res)=>{
    res.render('login',{layout:'edit_layout'});
})


router.post('/',(req,res,next)=>{
    // console.log(req.body);
    let errors = [];
    if(req.body.email == ''){
        errors.push({ type: 'email', message: 'please enter Email' });
    }
    if(req.body.password == ''){
        errors.push({ type: 'password', message: 'please enter password' });
    }
    if(errors.length == 0){

        passport.authenticate('local',{
            successRedirect:'/student_listing',
            failureRedirect:'/student_listing'
        })(req,res,next);


        StudentDetail.find({sd_email:req.body.email, sd_password:req.body.password}).then(validPassword=>{
            if(validPassword.length == 0){
                    errors.push({ type: 'password2',  message: 'Incorrect username or password.' });
                    res.render('login',{errors:errors});
            } else {
                // console.log(validPassword);
                // console.log(validPassword[0].sd_email);
                user_session = req.session;
                user_session.email = validPassword[0].sd_email;
                user_session.name = (validPassword[0].sd_first_name) + ' ' + validPassword[0].sd_last_name;

                res.redirect('student_listing');
            }
        })
    } else {
        res.render('login',{errors:errors});
    }
})









module.exports = router;