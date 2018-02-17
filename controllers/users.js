let models = require('../models');

let users = {};

users.create_user = (req,res) => {
	models.users.create(req.body)
	.then((result)=>{
		res.send("ok");
	})
	.catch((err)=>{
		res.status(400).send(err.message);
	});
}

users.fetch_user_details_by_id = (req,res) => {
	let user_id = req.params.user_id;
	if(user_id){
		console.log("-------------",user_id);
		//res.send("ok");

		models.users.findById(user_id)
		.then((user_detail)=>{
			
			if(user_detail){
				let user_info = {};
				user_info.user_id = user_detail.id;
				user_info.first_name = user_detail.first_name;
				user_info.last_name = user_detail.last_name;
				user_info.middle_name = user_detail.middle_name;
				user_info.mobile_number = user_detail.mobile_number;
				user_info.email_id = user_detail.email_id;

				let response = {};
				response.status_code = 200;
				response.user_info = user_info;
				response.message = "user detail found";
				console.log("+++++++++++++",JSON.stringify(user_info),delete user_info.id);
				res.send(response);	
			}else{
				let response = {};
				response.status_code = 200;
				response.message = "user with given id does not exist";
				//console.log("+++++++++++++",JSON.stringify(user_info),delete user_info.id);
				res.send(response);	
			}
			
		})
		.catch((err)=>{

			let response = {};
			let status_code = 400;
			response.message = err.message;
			res.status(400).send(response);

		});


	}else{
		res.status(400).send("user_id can not be empty");
	}
}

users.fetch_user_details_by_mobile_number = (req, res) => {
	let mobile_number = req.params.mobile_number;

	if(mobile_number){
		models.users.findOne({
		  where: {mobile_number: mobile_number}
		}).then(user_detail => {
		  	
		  	console.log("+++++++++++++++++++++++outer",JSON.stringify(user_detail));
		  	if(user_detail){
		  		console.log("+++++++++++++++++++++++",JSON.stringify(user_detail));
		  		//res.send(user_info);

		  		let user_info = {};
				user_info.user_id = user_detail.id;
				user_info.first_name = user_detail.first_name;
				user_info.last_name = user_detail.last_name;
				user_info.middle_name = user_detail.middle_name;
				user_info.mobile_number = user_detail.mobile_number;
				user_info.email_id = user_detail.email_id;

				let response = {};
				response.status_code = 200;
				response.user_info = user_info;
				response.message = "user detail found";
				console.log("+++++++++++++",JSON.stringify(user_info),delete user_info.id);
				res.send(response);	


		  	}else{

		  		let response = {};
				response.status_code = 200;
				response.message = "user with given mobile_number does not exist";
				res.send(response);	

		  	}

		})
		.catch( (err) => {

			let response = {};
			let status_code = 400;
			response.message = err.message;
			res.status(400).send(response);

		} );	
	}else{
		res.status(400).send("mobile_number can not be empty");	
	}
}

module.exports = users;
