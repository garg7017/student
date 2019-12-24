const StudentDetail = require('../models/StudentDetail');
const StudentAcedemicDetail = require('../models/StudentAcedemicDetail');
const { validate } = require('../helpers/form_validation_helper')

const express = require('express');
const router = express.Router();
const app = express();
const countryStatePpicker = require('country-state-picker');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/images/' });
const bcrypt = require('bcryptjs');



router.use('/login', require('./login'));
router.use('/student-listing', require('./studentListing'));
router.use('/export_csv', require('./exportCsv'));


/**
 * Logout route
 */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});







/**
 * Delete student data from collection (student & academic data)
 */
router.delete('/:id', (req, res) => {
    authorize = checkAuthantication(req);
    if (authorize) {
        id = req.params.id;

        StudentAcedemicDetail.deleteMany({ sad_student_id: id }).then(removeAcademicData => {
            StudentDetail.remove({ _id: id }).then(removeStudent => {
                console.log('Removed student data from document');
                res.redirect('student_listing');
            })
        })
    } else {
        res.redirect('login');
    }
})




/**
 * Check user login
 */
function checkAuthantication(req) {
    // let authorize = false;
    // user_session = req.session;
    // console.log(user_session.email);
    // if (user_session.email) {
        return true;
    // } else {
    //     return false;
    // }
}




router.get('/', (req, res) => {
    authorize = checkAuthantication(req);
    if (authorize) {
        let countries = countryStatePpicker.getCountries();
        res.render('index', { countries: countries });
    } else {
        res.redirect('login');
    }
})







/**
 * Edit student case
 */
router.get('/edit_student/:id', (req, res) => {
    id = req.params.id;
    StudentDetail.findById(id).then(student => {
        StudentAcedemicDetail.find({ sad_student_id: id }).then(academicData => {
            res.render('edit_student', { layout: 'edit_layout', data: student, data2: academicData });
        })
    })
})


/**
 * Edit Post data
 */
router.post('/edit_student/update_student', (req, res) => {
    var id = req.body.update;
    errors = validate(req);
    if (errors.length == 0) {
        //update data
        StudentDetail.findOne({ _id: id }).then(data => {
            data.sd_first_name = req.body.first_name;
            data.sd_last_name = req.body.last_name;
            data.sd_dob = req.body.date;
            data.sd_email = req.body.email;
            if (req.body.password != '') {
                data.sd_password = req.body.password;
            }

            data.sd_phone = req.body.contact_no;
            data.sd_gender = req.body.gender;
            data.sd_address = req.body.address_line1;
            data.sd_city = req.body.city;
            data.sd_zip_code = req.body.pincode;
            data.sd_state = req.body.state;
            data.sd_country = req.body.country;
            var hobbies = req.body.hobby.join(',')
            data.sd_hobbies = hobbies;
            data.sd_applied_course = req.body.course;


            data.save().then(updateStaudentDetail => {
                //Update 10th academic details
                StudentAcedemicDetail.find({ sad_student_id: id, sad_course_name: '10' }).then(academicData => {
                    academicData.sad_board = req.body.X_board;
                    academicData.sad_percentage = req.body.X_perc;
                    academicData.sad_year_of_passing = req.body.X_yop;
                    academicData.save().then(updateAcademic_X => {
                        console.log("Update 10th data");
                    })
                })

                //Update 12th academic details
                StudentAcedemicDetail.find({ sad_student_id: id, sad_course_name: '12' }).then(academicData_XII => {
                    academicData_XII.sad_board = req.body.XII_board;
                    academicData_XII.sad_percentage = req.body.XII_perc;
                    academicData_XII.sad_year_of_passing = req.body.XII_yop;
                    academicData_XII.save().then(updateAcademic_XII => {
                        console.log("Update 12th data");
                    })
                })
                res.render('student_listing');
            })
        })
    } else {
        res.render('edit_student', { layout: 'edit_layout', errors: errors, req: req });
    }
})




// router.get('/index', (req,res)=>{
//     let countries = countryStatePpicker.getCountries();
//     res.render('index',{countries:countries});  
// })


/** 
 * Registration case
 * */
router.post('/index', upload.single('avatar'), (req, res) => {

    // console.log(req);
    // console.log(req.body);
    // console.log(req.avatar);
    // if(req.file){
    //     res.json(req.file);
    // } else {
    //     throw 'error';
    // }
    // return false;



    // console.log(encrypted_pwd);
    // return false;

    hobby_arr = req.body.hobby;
    errors = validate(req);

    let countries = countryStatePpicker.getCountries();

    if (errors.length != 0) {
        // res.send(errors);
        StudentDetail.findOne({ sd_email: req.body.email }).then(student => {
            // console.log(student);
            if (student == null) {
                res.render('index', { errors: errors, req: req, hobby_arr: req.body.hobby, countries: countries });
            } else {
                errors.push({ type: 'email2', message: 'Email id should be unique' });
                res.render('index', { errors: errors, req: req, hobby_arr: req.body.hobby, countries: countries });
            }
        })
    } else {
        //save data
        let hobbies = '';
        hobbies = hobby_arr.join(',');

        const newStudent = new StudentDetail({
            sd_first_name: req.body.first_name,
            sd_last_name: req.body.last_name,
            sd_dob: req.body.date,
            sd_email: req.body.email,
            sd_password: req.body.password,
            sd_phone: req.body.contact_no,
            sd_gender: req.body.gender,
            sd_address: req.body.address_line1,
            sd_city: req.body.city,
            sd_zip_code: req.body.pincode,
            sd_state: req.body.state,
            sd_country: req.body.country,
            sd_hobbies: hobbies,
            sd_applied_course: req.body.course
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newStudent.sd_password, salt, (err, hash) => {
                newStudent.sd_password = hash;

                newStudent.save().then(savedStudent => {
                    var inserted_id = savedStudent._id;
                    //Save X data in student acedamic detais table
                    const StudentAcedemicDetail_X = new StudentAcedemicDetail({
                        sad_student_id: inserted_id,
                        sad_course_name: '10',
                        sad_board: req.body.X_board,
                        sad_percentage: req.body.X_perc,
                        sad_year_of_passing: req.body.X_yop
                    });
                    StudentAcedemicDetail_X.save().then(saveAcademic_X => {
                        console.log("saved X data");
                    })
                    //Save XII data in student acedamic detais table
                    const StudentAcedemicDetail_XII = new StudentAcedemicDetail({
                        sad_student_id: inserted_id,
                        sad_course_name: '12',
                        sad_board: req.body.XII_board,
                        sad_percentage: req.body.XII_perc,
                        sad_year_of_passing: req.body.XII_yop
                    });
                    StudentAcedemicDetail_XII.save().then(saveAcademic_XII => {
                        console.log("saved XII data");
                        res.redirect('student-listing');
                    })
                });
            })
        })
    }
})






module.exports = router;