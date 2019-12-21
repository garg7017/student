module.exports = {
    validate: function (req) {
        let errors = [];

        if (!req.body.first_name) {
            errors.push({ type: 'first_name', message: 'please enter First name' });
        }
        if (!req.body.last_name) {
            errors.push({ type: 'last_name', message: 'please enter Last name' });
        }
        if (!req.body.date) {
            errors.push({ type: 'dob', message: 'please enter Date of Birth' });
        }
        if (!req.body.email) {
            errors.push({ type: 'email', message: 'please enter Email' });
        }


        if( typeof req.body.update != 'undefined' && req.body.update != ''){
            // Edit case
            if (req.body.password != '') {
                //error
                if (!req.body.password) {
                    errors.push({ type: 'password', message: 'please enter Password' });
                }
                if (!req.body.confirm_password) {
                    errors.push({ type: 'confirm_password', message: 'please enter Confirm Password' });
                }
                if (req.body.password != req.body.confirm_password) {
                    errors.push({ message: 'Password do not match' });
                }
            }
        } else {
            //Register case
            if (!req.body.password) {
                errors.push({ type: 'password', message: 'please enter Password' });
            }
            if (!req.body.confirm_password) {
                errors.push({ type: 'confirm_password', message: 'please enter Confirm Password' });
            }
            if (req.body.password != req.body.confirm_password) {
                errors.push({ message: 'Password do not match' });
            }
        }

        

        
        if (!req.body.contact_no) {
            errors.push({ type: 'phone_no', message: 'please enter Phone number' });
        }
        if (!req.body.address_line1) {
            errors.push({ type: 'address', message: 'please enter address' });
        }
        if (!req.body.city) {
            errors.push({ type: 'city', message: 'please enter city' });
        }
        if (!req.body.pincode) {
            errors.push({ type: 'pincode', message: 'please enter zip code' });
        }
        if (!req.body.state) {
            errors.push({ type: 'state', message: 'please enter state' });
        }
        if (typeof req.body.hobby != "undefined") {
            hobby_arr = req.body.hobby;
        } else {
            hobby_arr = [];
        }
        if (hobby_arr.length === 0) {
            errors.push({ type: 'hobby', message: 'Please select any hobby' });
        }
        if (req.body.country.trim() == '') {
            errors.push({ type: 'country', message: 'Please select country' });
        }
        if (!req.body.X_board) {
            errors.push({ type: 'X_board', message: 'Please fill X-board' });
        }
        if (!req.body.X_perc) {
            errors.push({ type: 'X_perc', message: 'Please fill X-perc' });
        } else if (req.body.X_perc > 100 || req.body.X_perc < 0) {
            errors.push({ type: 'X_perc', message: 'X: Please enter valid percentage' });
        }
        if (!req.body.X_yop) {
            errors.push({ type: 'X_yop', message: 'Please fill X-yop' });
        }
        if (!req.body.XII_board) {
            errors.push({ type: 'XII_board', message: 'Please fill XII-board' });
        }
        if (!req.body.XII_perc) {
            errors.push({ type: 'XII_perc', message: 'Please fill XII-perc' });
        } else if (req.body.XII_perc > 100 || req.body.XII_perc < 0) {
            errors.push({ type: 'XII_perc', message: 'XII: Please enter valid percentage' });
        }
        if (!req.body.XII_yop) {
            errors.push({ type: 'XII_yop', message: 'Please fill XII-yop' });
        }
        if (!req.body.course) {
            errors.push({ type: 'course', message: 'Please select course' });
        }

        return errors;
        
    }

}

    /** End of Form Fields validation */