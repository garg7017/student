const StudentDetail = require('../models/StudentDetail');
const StudentAcedemicDetail = require('../models/StudentAcedemicDetail');
const { validate } = require('../helpers/form_validation_helper')

const express = require('express');
const router = express.Router();
const app = express();
const countryStatePpicker = require('country-state-picker');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;




router.post('/export_csv',(req,res)=>{
    let student_arr = [];

    const csvWriter = createCsvWriter({
        path: 'C:/node/new_course/student_node/public/uploads/files/out.csv',
        header: [
          {id: 'id', title: 'ID'},
          {id: 'fname', title: 'FirstName'},
          {id: 'lname', title: 'LastName'},
          {id: 'dob', title: 'DOB'},
          {id: 'email', title: 'Email'},
          {id: 'phone', title: 'Phone'},
          {id: 'gender', title: 'Gender'},
          {id: 'address', title: 'Address'},
          {id: 'city', title: 'City'},
          {id: 'zip_code', title: 'ZipCode'},
          {id: 'state', title: 'State'},
          {id: 'country', title: 'Country'},

          {id: 'hobbies', title: 'Hobbies'},
          {id: 'applied_course', title: 'AppliedCourse'},
          {id: 'course_name', title: 'CourseName'},
          {id: 'board', title: 'Board'},
          {id: 'percentage', title: 'Percentage'},
          {id: 'yop', title: 'Year Of Passing'},

          {id: 'course_name', title: 'CourseName'},
          {id: 'board', title: 'Board'},
          {id: 'percentage', title: 'Percentage'},
          {id: 'yop', title: 'Year Of Passing'},
        ]
      });
    //   csvWriter.writeRecords(student_arr).then(saved=>{
    //       console.log('saved successfully');
    //   }).catch(err=>{
    //       console.log(err);
    //   })


    StudentDetail.find({}).then(students=>{
        for(let student of students){
            id = student._id;
            student_arr = JSON.stringify(student);
            // console.log(student_arr);
            StudentAcedemicDetail.find({sad_student_id:student._id}).then(academicDetails=>{
                if(academicDetails.length > 0){
                    for(let academicDetail of academicDetails){
                        if(academicDetail.sad_course_name == '10'){
                            academic_data_X = JSON.stringify(academicDetail);
                            student_arr = student_arr + academic_data_X;
                        } else {
                            academic_data_XII = JSON.stringify(academicDetail);
                            student_arr = student_arr + academic_data_XII;
                        }
                    }
                
                }
            })
        }
        csvWriter.writeRecords(student_arr).then(saved=>{
            console.log('The CSV file was written successfully');
        }).catch(err=>{
            console.log(err);
        })
    })
})



/**
 * Login Route
 */
/**
* Commented code Prashant
*router.get('/login',(req,res)=>{
*    res.render('login',{layout:'edit_layout'});
*})
*/


/**
 * Logout route
 */
router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});


router.post('/login',(req,res)=>{
    let errors = [];
    if(req.body.email == ''){
        errors.push({ type: 'email', message: 'please enter Email' });
    }
    if(req.body.password == ''){
        errors.push({ type: 'password', message: 'please enter password' });
    }
    if(errors.length == 0){
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




/**
 * Delete student data from collection (student & academic data)
 */
router.delete('/:id',(req,res)=>{
    authorize = checkAuthantication(req);
    if(authorize){
        id = req.params.id;

        StudentAcedemicDetail.deleteMany({sad_student_id:id}).then(removeAcademicData => {
            StudentDetail.remove({_id:id}).then(removeStudent =>{
                console.log('Removed student data from document');
                res.redirect('student_listing');
            })
        }) 
    } else {
        res.redirect('login');
    }
})



/**
 * Student listing route
 */

router.get('/student_listing', (req,res)=>{
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

/** End of student listing route */


/**
 * Check user login
 */
function checkAuthantication(req){
    let authorize = false;
    user_session = req.session;
    console.log(user_session.email);
    if(user_session.email){
        return true;
    } else {
        return false;
    }
}




router.get('/',(req,res)=>{
    authorize = checkAuthantication(req);
    if(authorize){
        let countries = countryStatePpicker.getCountries();
        res.render('index',{countries:countries});
    } else {
        res.redirect('login');
    }
})



//Student Listing: pagination

router.get('/student-listing/:page', async (req, res, next) => {
    
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



/**
 * Edit student case
 */
router.get('/edit_student/:id',(req,res)=>{
    id = req.params.id;
    StudentDetail.findById(id).then(student=>{
        StudentAcedemicDetail.find({sad_student_id:id}).then(academicData =>{
            res.render('edit_student', {layout: 'edit_layout', data:student,data2:academicData });
        })         
    })
})


/**
 * Edit Post data
 */
router.post('/edit_student/update_student',(req,res)=>{
    var id = req.body.update;
    errors = validate(req);
    if(errors.length == 0){
        //update data
        StudentDetail.findOne({_id: id}).then(data=>{
            data.sd_first_name = req.body.first_name;
            data.sd_last_name = req.body.last_name;
            data.sd_dob = req.body.date;
            data.sd_email = req.body.email;
            if(req.body.password != ''){
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


            data.save().then(updateStaudentDetail =>{
                //Update 10th academic details
                StudentAcedemicDetail.find({sad_student_id:id,sad_course_name:'10'}).then(academicData=>{
                    academicData.sad_board = req.body.X_board;
                    academicData.sad_percentage = req.body.X_perc;
                    academicData.sad_year_of_passing = req.body.X_yop;
                    academicData.save().then(updateAcademic_X=>{
                        console.log("Update 10th data");
                    })
                })

                //Update 12th academic details
                StudentAcedemicDetail.find({sad_student_id:id,sad_course_name:'12'}).then(academicData_XII=>{
                    academicData_XII.sad_board = req.body.XII_board;
                    academicData_XII.sad_percentage = req.body.XII_perc;
                    academicData_XII.sad_year_of_passing = req.body.XII_yop;
                    academicData_XII.save().then(updateAcademic_XII=>{
                        console.log("Update 12th data");
                    })
                })
                res.render('student_listing');
            })
        })
    } else {
        res.render('edit_student', {layout: 'edit_layout', errors:errors,req:req });
    }
})




router.get('/index', (req,res)=>{
    let countries = countryStatePpicker.getCountries();
    res.render('index',{countries:countries});  
})


/** 
 * Registration case
 * */
router.post('/index',(req,res)=>{
    // console.log(req.body.hobby);
    hobby_arr = req.body.hobby;
    errors = validate(req);

    let countries = countryStatePpicker.getCountries();

    if(errors.length != 0){
        // res.send(errors);
        StudentDetail.findOne({sd_email:req.body.email}).then(student =>{
            console.log(student);
            if(student == null){
                res.render('index', { errors: errors,req:req,hobby_arr:req.body.hobby,countries:countries});
            } else {
                errors.push({type: 'email2', message: 'Email id should be unique'});
                res.render('index', { errors: errors,req:req,hobby_arr:req.body.hobby,countries:countries});
            }
        })
    } else{
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
            newStudent.save().then(savedStudent =>{
                var inserted_id = savedStudent._id;
                //Save X data in student acedamic detais table
                const StudentAcedemicDetail_X = new StudentAcedemicDetail({
                    sad_student_id:inserted_id,
                    sad_course_name: '10',
                    sad_board: req.body.X_board,
                    sad_percentage: req.body.X_perc,
                    sad_year_of_passing: req.body.X_yop
                });
                StudentAcedemicDetail_X.save().then(saveAcademic_X =>{
                    console.log("saved X data");
                })
                //Save XII data in student acedamic detais table
                const StudentAcedemicDetail_XII = new StudentAcedemicDetail({
                    sad_student_id:inserted_id,
                    sad_course_name: '12',
                    sad_board: req.body.XII_board,
                    sad_percentage: req.body.XII_perc,
                    sad_year_of_passing: req.body.XII_yop
                });
                StudentAcedemicDetail_XII.save().then(saveAcademic_XII =>{
                    console.log("saved XII data");
                    res.render('student_listing');
                })
        });
    }
})






module.exports = router;
