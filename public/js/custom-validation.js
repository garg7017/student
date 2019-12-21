$(document).ready(function()
{
	
	$('.submit-form').click(function()
	{
		
		var pswd_value = $('input[name="password"]').val();
		var confirm_pswd_value = $('input[name="confirm_password"]').val();
		if(pswd_value !== confirm_pswd_value)
		{
			$('input[name="confirm_password"]').after('<label id="confirm-password-error" class="custom-error">'+ 'Your password does not match.' +'</label>');	
			
		}
		else{
			$('.custom-error').remove();
		}
		
		
		var gender_val = $('input[name="course"]:checked').val();
		if(gender_val == '' || gender_val == undefined)
		{
			$('.controls').before('<label id="gender-error" class="custom-error">'+ 'Select your applied course.' +'</label>');
		}
		else{
			$('.custom-error').remove();
		}
		
		
		
	});	
	
	
	
});