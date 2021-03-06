const StudentDetail = require('../models/StudentDetail');
const StudentAcedemicDetail = require('../models/StudentAcedemicDetail');
const { validate } = require('../helpers/form_validation_helper')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const app = express();
const countryStatePpicker = require('country-state-picker');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/images/' });
const bcrypt = require('bcryptjs');
const faker = require('faker');



router.use('/login', require('./login'));
router.use('/student-listing', require('./studentListing'));
router.use('/export_csv', require('./exportCsv'));
router.use('/logout', require('./logout'));





//generate fake student records
router.post('/generate-fake-student',(req,res)=>{
    // res.send('Working');

    for(let i=0; i<= 100;i++){
        let studentDetail = new StudentDetail();

        studentDetail.sd_first_name = faker.name.findName();
        studentDetail.sd_last_name = 'Garg';
        studentDetail.sd_dob = faker.date.future();
        studentDetail.sd_email = faker.internet.email();
        studentDetail.sd_password = '123';
        studentDetail.sd_phone = '9636377696';
        studentDetail.sd_gender = 'Male';
        studentDetail.sd_address = faker.address.streetAddress();
        studentDetail.sd_city = faker.address.city();
        studentDetail.sd_zip_code = '321201';
        studentDetail.sd_state = faker.random.words();
        studentDetail.sd_country = faker.address.country();
        studentDetail.sd_hobbies = faker.random.words();
        studentDetail.sd_applied_course = 'ba';


        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(studentDetail.sd_password, salt, (err, hash) => {
                studentDetail.sd_password = hash;

                studentDetail.save().then(fakeStudentSaved=>{
                    console.log("saved data");
                }).catch(err=>{
                    console.log(err);
                })

            })
        });
    }
})







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
function checkAuthantication(req){
    let authorize = false;
    if(typeof req.session.passport != 'undefined'){
        user_session = req.session;
        if(typeof req.session.passport.user == 'undefined'){
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}



/**
 * Index page: form to register a student
 */
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
    let countries = countryStatePpicker.getCountries();
    StudentDetail.findById(id).then(student => {
        StudentAcedemicDetail.find({ sad_student_id: id }).then(academicData => {
            res.render('edit_student', { layout: 'edit_layout', data: student, data2: academicData,countries:countries });
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
                    if(academicData.length > 0){
                        academicData.sad_board = req.body.X_board;
                        academicData.sad_percentage = req.body.X_perc;
                        academicData.sad_year_of_passing = req.body.X_yop;
                        academicData.update.then(updateAcademic_X => {
                            console.log("Update 10th data");
                        })
                    } else {
                        const acedemicDetail_X = new StudentAcedemicDetail({
                            sad_student_id: id,
                            sad_course_name: '10',
                            sad_board: req.body.X_board,
                            sad_percentage: req.body.X_perc,
                            sad_year_of_passing: req.body.X_yop,
                        })

                        acedemicDetail_X.save().then(saved=>{
                            console.log("data saved: X");
                        })
                    }
                })

                //Update 12th academic details
                StudentAcedemicDetail.find({ sad_student_id: id, sad_course_name: '12' }).then(academicData_XII => {
                    if(academicData_XII.length > 0){
                        academicData_XII.sad_board = req.body.XII_board;
                        academicData_XII.sad_percentage = req.body.XII_perc;
                        academicData_XII.sad_year_of_passing = req.body.XII_yop;
                        academicData_XII.update().then(updateAcademic_XII => {
                            console.log("Update 12th data");
                        })
                    } else {
                        const acedemicDetail_XII = new StudentAcedemicDetail({
                            sad_student_id: id,
                            sad_course_name: '12',
                            sad_board: req.body.XII_board,
                            sad_percentage: req.body.XII_perc,
                            sad_year_of_passing: req.body.XII_yop,
                        })

                        acedemicDetail_XII.save().then(saved=>{
                            console.log("data saved: XII");
                        })
                    }
                })
                res.redirect('student-listing');
            })
        })
    } else {
        res.render('edit_student', { layout: 'edit_layout', errors: errors, req: req });
    }
})



/** 
 * Registration case
 * */
router.post('/index', (req, res) => {

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
