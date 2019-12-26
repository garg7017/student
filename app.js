const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cors = require('cors');
var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose'); 
const methodOverride = require('method-override');
const session = require('express-session')
const app = express();
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');
const flash = require('connect-flash');




// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


mongoose.Promise = global.Promise;

/** Connection string to connect with DB */
mongoose.connect(mongoDbUrl,{useNewUrlParser: true,useUnifiedTopology: true },(err) => {
	if(err){
		console.log(err);
	} else {
		console.log("connected to the database");
	}
});


app.use(session({secret: 'user_session',saveUninitialized: true,resave: true}));

app.use(flash());


app.use((req, res, next)=>{
	res.locals.user = req.session;
	next();
});


// app.use(function (req, res, next) {
// 	if(typeof req.sessionOptions.maxAge != 'undefined'){
// 				req.sessionOptions.maxAge = 2 * 60 * 60 * 1000 // 2 hours,
// 	} 
// 	next()
// })

// PASSPORT

app.use(passport.initialize());
app.use(passport.session());



// Load Routes
const register = require('./routes/register');
const login = require('./routes/login');
const studentListing = require('./routes/studentListing');

// Use Routes
app.use('/', register);
app.use('/index', register);
app.use('/login', login);
app.use('/student_listing', studentListing);


const port = process.env.PORT || 3000;

// Server Port
app.listen(port, function(){
    console.log(`Sever is running on Port ${port}`);
});

