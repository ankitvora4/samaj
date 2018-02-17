let models = require('../models');

let programs = {};

programs.create_program = (req,res) => {

	console.log("req.body.god_father_token=============",req.body.god_father_token, typeof req.body.god_father_token);
	console.log("req.body.secret_key++++++++++",req.body.secret_key , typeof req.body.secret_key);
	console.log("req.body.client_id============",req.body.client_id, typeof req.body.client_id);

	if(req.body.god_father_token === "6143bjxhb4t382y4vbkaghe578tghfw8e5yt7" && req.body.secret_key === "bsafhgf4138723" && req.body.client_id === "124872713"){
		
		if(req.body.event && req.body.event.subject && req.body.event.message){
			
			models.programs.create(req.body.event)
			.then((program)=>{

				console.log("+++++++++++++++++++++",JSON.stringify(program));

				let response = {};
				response.status_code = 200;
				response.message = "program create successfully";
				response.program_id = program.id;

				res.status(200).send(response);

			})	
			.catch((err)=>{
				res.status(400).send(err.message);
			});			

		}else{
			res.status(400).send("program must have subject and message");
		}
		//res.send("ok");

	}else{
		res.status(400).send("you dont have access to create program");
	}
}

programs.fetch_programs = (req,res) => {

	models.programs.findAll()
	.then((program_details)=>{
		console.log("++++++++++++++++++++",JSON.stringify(program_details));

		let program_list = [];

		let img_arr = [];
		img_arr.push("https://www.hdwallpapers.in/walls/teenage_mutant_ninja_turtles_tmnt_2014-wide.jpg");
		img_arr.push("http://cdn.animalhi.com/1496x818/20121026/teenage%20mutant%20ninja%20turtles%201496x818%20wallpaper_www.animalhi.com_67.jpg");
		img_arr.push("http://avante.biz/wp-content/uploads/Tmnt-Wallpaper/Tmnt-Wallpaper-009.jpg");

		program_details.forEach((program) => {

			let program_info = {};
			program_info.program_id = program.id;
			program_info.subject = program.subject;
			program_info.message = program.message;
			program_info.galley = img_arr;

			program_list.push(program_info);
		});

		let response = {};
		response.status_code = 200;
		response.message = "program_list found";
		response.program_list = program_list;

		res.send(response);
	})
	.catch((err)=>{
		res.status(400).send(err.message);
	});

};

module.exports = programs;
