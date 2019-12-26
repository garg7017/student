const StudentDetail = require('../models/StudentDetail');
const StudentAcedemicDetail = require('../models/StudentAcedemicDetail');

const express = require('express');
const router = express.Router();

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

router.post('/',(req,res)=>{
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

      var student_arr = new Array();      
      var dataArray = new Array();

    //   StudentDetail.find(function (err,students){
    //       if(err) throw err;
    //       console.log(students);
    //   }) 
    
    

    // StudentAcedemicDetail.find({sad_student_id:'5dfe10f0fb1de41870a671aa'},function (err,academicDetails){
    //     if(err) throw err;
    //     console.log(academicDetails);
    // })




    // StudentDetail.find({}).then(students=>{
    StudentDetail.find(function (err,students){
        for(let student of students){
            
            id = student._id;
            // Student details 
            dataArray['id'] = student._id;
            dataArray['first_name'] = student.sd_first_name;
            dataArray['last_name'] = student.sd_last_name;
            dataArray['dob'] = student.sd_dob;
            dataArray['email'] = student.sd_email;
            dataArray['phone'] = student.sd_phone;
            dataArray['gender'] = student.sd_gender;
            dataArray['address'] = student.sd_address;
            dataArray['city'] = student.sd_city;
            dataArray['zip_code'] = student.sd_zip_code;
            dataArray['state'] = student.sd_state;
            dataArray['country'] = student.sd_country;
            dataArray['hobbies'] = student.sd_hobbies;
            dataArray['applied_course'] = student.sd_applied_course;


            //Academic Details
            StudentAcedemicDetail.find({sad_student_id:student._id},  function(err,academicDetails){
                if(academicDetails.length > 0){
                    for(let academicDetail of academicDetails){
                        if(academicDetail.sad_course_name == '10'){
                            dataArray['course_name_X'] = academicDetail.sad_course_name;
                            dataArray['board_X'] = academicDetail.sad_board;
                            dataArray['percentage_X'] = academicDetail.sad_percentage;
                            dataArray['yop_X'] = academicDetail.sad_year_of_passing;
                        } else {
                            dataArray['course_name_XII'] = academicDetail.sad_course_name;
                            dataArray['board_XII'] = academicDetail.sad_board;
                            dataArray['percentage_XII'] = academicDetail.sad_percentage;
                            dataArray['yop_XII'] = academicDetail.sad_year_of_passing;
                        }
                    }
                    student_arr.push(dataArray);
                }
            })
        }
        // callback(student_arr);
    })
    
    // csvWriter.writeRecords(student_arr).then(saved=>{
    //     console.log('The CSV file was written successfully');
    // }).catch(err=>{
    //     console.log(err);
    // })
});




module.exports = router;