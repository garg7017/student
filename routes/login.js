const StudentDetail = require('../models/StudentDetail');

const express = require('express');
const router = express.Router();
const app = express();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


router.get('/',(req,res)=>{
    res.render('login',{layout:'edit_layout'});
})





passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
    StudentDetail.find({sd_email:email}).then(user=>{
        if(!user) return done(null, false, {message: 'No user found'});
        
        bcrypt.compare(password, user[0].sd_password, (err, matched)=>{
            if(matched){
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        })
    })
}));


passport.serializeUser(function(user, done) {
    done(null, user[0]._id);
});

passport.deserializeUser(function(id, done) {
    StudentDetail.findById(id, function(err, user) {
        done(err, user);
    });
});





router.post('/',(req,res,next)=>{
    let errors = [];
    if(req.body.email == ''){
        errors.push({ type: 'email', message: 'please enter Email' });
    }
    if(req.body.password == ''){
        errors.push({ type: 'password', message: 'please enter password' });
    }
    if(errors.length == 0){
        passport.authenticate('local',{
            successRedirect:'/student-listing',
            failureRedirect:'/login',
            failureFlash: true
        })(req,res,next);
    } else {
        res.render('login',{layout:'edit_layout', errors:errors});
    }
})




router.get('/login',(req,res,next)=>{
    res.render('login',{layout:'login'});
});











module.exports = router;
