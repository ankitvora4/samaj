let models = require('../models');

var jwt = require('jsonwebtoken');
var uuidv1 = require('uuid/v1');

var authentication = {};

authentication.send_otp = (req,res) => {
	let mobile_number = req.body.mobile_number;

	//console.log("+++++++++++++++inside the controller");
	let val = Math.floor(1000 + Math.random() * 9000);
	console.log("+++++++++++++++++++>>>>>>>>>>>otp is:::",val);

	let generate_otp = {
		mobile_number : mobile_number,
		is_verified : 0,
		otp : val
 	};

	models.otps.create(generate_otp)
	.then((result)=>{
		let response = {
			"mobile_number" : 9818620296,
			"otp" : val,
			"status_code" : 200,
			"message" : "otp generated"
		};
		
		res.status(200).send(response);
	})
	.catch((err) => {
		
		res.status(400).send("something is wrong with otp generation");
	});
	
}

authentication.authenticate_user = (req,res) => {
	let user_name = req.body.user_name;
	let password = req.body.password;

	let err_message;
	let response;
	if(user_name && password){
		models.users.find({
			where : {
				user_name : user_name
			}
		})
		.then((user_detail) => {
			if(user_detail != null){
				console.log("--------------->>>>>>>>>>>>>",JSON.stringify(user_detail));
				
				console.log("$$$$$$$$$$$",user_detail.password, password);

				if(user_detail.password == password){
					console.log("############why i m not here");
					let payload = {
						"user_name" : user_detail.user_name
 					}

					jwt.sign(payload, "helloworld", {
					      expiresIn: 24 * 60 * 60 // expires in 24 hours
					    }, (err,token) => {
					    	if(!err){

					    		console.log("===============token is ::::",token)
							    // return the information including token as JSON
								
								response = {};
								response.status_code = 200;
								response.message = "successfully login";
								response.token = token;
								response.user_name = user_name;

							    res.status(200).send(response);
					    	}else{
					    		response = {};
					    		response.status_code = 400;
					    		response.message = "something wrong with the token generation";

					    		res.status(400).send(response);
					    		//console.log("_____________________________",err.message);
					    	}
					    });

					

				}else{

					err_message = "user name or password is not valid";
					response = {};
					response.status_code = 400;
					response.message = err_message;

					res.status(400).send(response);
				}
			}else{

				err_message = "user name is not valid or is not verified"
				
				response = {};
				response.status_code = 400;
				response.message = err_message;
				
				res.status(400).send(response);
			}
		})
		.catch((err)=>{

			response = {};
			response.status_code = 400;
			response.message = err.message;

			res.status(400).send(response);

		});
	}else{
		if(!user_name){
			err_message = "user name can not be empty";
 		}else{
 			err_message = "password can not be empty";
 		}

 		response = {};
 		response.status_code = 400;
 		response.message = err_message;

 		res.status(400).send(response);	
	}
}

authentication.decode_user = (req,res) =>{
	let user_token = req.body.token;

	let err_message,response;

	if(user_token){
		jwt.verify(user_token, "helloworld" , function(err, decoded) {      
	      if (err) {
	        console.log("-------------------err",err.message);
	        //return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      	err_message = "invalid token for authentication";
	      	response = {};
	      	response.status_code = 400;
	      	response.message = err_message;

	      	res.status(400).send(response);

	      } else {
	        // if everything is good, save to request for use in other routes
	        	console.log("--------------------decoded",JSON.stringify(decoded));

	        response = {};
	        response.status_code = 200;
	        response.message = "successfully decoded user";
	        response.user_name = decoded.user_name;

	        res.status(200).send(response);
	      }
	    });

	}else{
		err_message = "user token can not be empty";
		
	  	response = {};
	  	response.status_code = 400;
	  	response.message = err_message;

	  	res.status(400).send(response);		
	}
}

authentication.verify_otp = (req,res) => {
	let otp = req.body.otp;
	let mobile_number = req.body.mobile_number;

	let err_message, response;

	if(otp && mobile_number){

		models.otps.find({
			order : [['id','DESC']],
			where : {
				mobile_number : mobile_number,
				otp : otp,
				is_verified : 0
			}
		})
		.then((result)=>{
			if(result){

				console.log("++++++++++++++++++++++result::::",JSON.stringify(result));
				let user_secret = uuidv1();

				models.otps.update({
					is_verified : 1, 
					user_secret : user_secret
				},{
					where : {
						otp : otp,
						mobile_number : mobile_number
					}
				})
				.then( (updates)=> {
					console.log("------------------------updates::::",JSON.stringify(updates));

					let response = {};
					response.message = "otp updated successfully";
					response.status_code = 200;
					response.mobile_number = mobile_number;

					response.user_secret = user_secret;
					res.status(200).send(response);
					//return;
				})
				.catch((err)=>{

					response = {};
					response.message = "fail to update the user otp";
					response.status_code = 400;
					response.mobile_number = mobile_number;
					response.otp = otp;


					res.status(400).send(response);
				});


			}else{

				response = {};
				response.message = "otp does not exist";
				response.status_code = 400;
				response.mobile_number = mobile_number;
				response.otp = otp;
				

				res.status(400).send(response);
				console.log("*********************");
			}
		})
		.catch((err)=>{
			response = {};
			response.message = "unable to fing the user otp";
			response.status_code = 400;
			response.mobile_number = mobile_number;
			response.otp = otp;
			

			res.status(400).send(response);

			//console.log("&&&&&&&&&&&&&&&&&&&&&",err.message);
		});
	}else{
		err_message = "otp or mobile number can not be empty";

		response = {};
		response.message = err_message;
		response.status_code = 400;

		res.status(400).send(response);
	}
}

authentication.update_password = (req,res) => {
	let user_secret = req.body.user_secret;
	let new_password = req.body.new_password;
	let mobile_number = req.body.mobile_number;

	let err_message, response;

	if(new_password && user_secret && mobile_number){

		models.otps.find({
			where : {
				mobile_number : mobile_number,
				user_secret : user_secret
			}
		})
		.then( (user_detail) => {
			if(user_detail){
				models.users.update({
					password : new_password
				},{
					where : {
						mobile_number : mobile_number
					}
				})
				.then((result)=>{
					response = {};

					response.status_code = 200;
					response.message = "password updated successfully";

					res.status(200).send(response);
				})
				.catch((err)=>{
					response = {};

					response.status_code = 400;
					response.message = err.message;

					res.status(400).send(response);
				});
			}else{
				response = {};

				response.status_code = 400;
				response.message = "not able to find the user for given  mobile_number";

				res.status(400).send(response);
			}
		})
		.catch((err)=>{
			response = {};

			response.status_code = 400;
			response.message = err.message;

			res.status(400).send(response);	
		})
	}else{
		response = {};

		response.status_code = 400;
		response.message = "user_secret, mobile_number or new_password can not be empty";

		res.status(400).send(response);
	}
}

module.exports = authentication;