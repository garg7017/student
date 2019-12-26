
const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/',(req,res)=>{
    req.logOut();
    res.redirect('/login');
})

module.exports = router;