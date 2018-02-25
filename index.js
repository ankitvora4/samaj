let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let urlencode = bodyParser.json({limit: '50mb', extended: true});

let users = require('./controllers/users');
let programs = require('./controllers/programs');
let authentication = require('./controllers/authentication');
const PORT = "9999";

exports.pong = (req,res) => {
	console.log("----");
	res.send("pong from docker");
}

app.get('/ping',exports.pong);

//user registration APIs
app.post('/create_user', urlencode, users.create_user);


app.get('/fetch_user_details/:user_id',users.fetch_user_details_by_id);
app.get('/fetch_user_details/mobile_number/:mobile_number',users.fetch_user_details_by_mobile_number);

//create program
app.post('/create_program', urlencode ,programs.create_program);
app.get('/fetch_programs',programs.fetch_programs);

//otps
app.post('/send_otp', urlencode, authentication.send_otp);
app.post('/verify_otp', urlencode, authentication.verify_otp);
app.post('/update_password', urlencode, authentication.update_password);

//authentication
app.post("/authenticate_user", urlencode, authentication.authenticate_user);
app.post('/decode_user', urlencode, authentication.decode_user);

app.listen( PORT , () => {
	console.log("application is up and running on " + PORT);
});