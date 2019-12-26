const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


const StudentDetailsSchema = new Schema({
    sd_first_name:{
        type: String,
        required: true
    },
    sd_last_name:{
        type: String,
        required: true
    },
    sd_dob:{
        type: Date,
        required: true
    },
    sd_email:{
        type: String,
        required: true
    },
    sd_password:{
        type: String,
        required: true
    },
    sd_phone:{
        type: Number,
        required: true
    },
    sd_gender:{
        type: String,
        required: true
    },
    sd_address:{
        type: String,
        required: true
    },
    sd_city:{
        type: String,
        required: true
    },
    sd_zip_code:{
        type: Number,
        required: true
    },
    sd_state:{
        type: String,
        required: true
    },
    sd_country:{
        type: String,
        required: true
    },
    sd_hobbies:{
        type: String,
        required: true
    },
    sd_applied_course:{
        type: String,
        required: true
    },
    sd_image:{
        type: String
    },
    sd_date_added:{
        type: Date,default: Date.now
    },
    sd_date_modified:{
        type: Date,
        default: Date.now
    },
});



module.exports = mongoose.model('student_details', StudentDetailsSchema);
