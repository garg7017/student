const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


const StudentAcedemicDetailSchema = new Schema({
    sad_student_id:{
        type: String,
        required: true
    },
    sad_course_name:{
        type: String,
        required: true
    },
    sad_board:{
        type: String,
        required: true
    },
    sad_percentage:{
        type: Number,
        required: true
    },
    sad_year_of_passing:{
        type: Number,
        required: true
    }
});



module.exports = mongoose.model('student_acedemic_details', StudentAcedemicDetailSchema);
