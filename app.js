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

app.use(bodyParser());
app.use(cors());
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


mongoose.Promise = global.Promise;

/** Connection string to connect with DB */
mongoose.connect('mongodb://root:Admin123@ds251158.mlab.com:51158/student',{ useNewUrlParser: true },(err) => {
	if(err){
		console.log(err);
	} else {
		console.log("connected to the database");
	}
});


app.use(session({secret: 'user_session',saveUninitialized: true,resave: true}));


// Load Routes

const register = require('./routes/register');
const login = require('./routes/login');
// const studentListing = require('./routes/studentListing');



// Use Routes

app.use('/', register);
app.use('/login', login);
// app.use('/student_listing', studentListing);



// Server Port
app.listen(3000, function(){
    console.log("Sever is running on Port 3000");
});

