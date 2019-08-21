
const mysql = require('../config/mysql');

const date = require('date-and-time');

module.exports = (app) => {


	/*------------------------------------------------------- Index ----------------------------------------------------*/

	app.get('/', async (req, res, next) => {

		let db = await mysql.connect();
		
		let [movies] = await db.execute(`
		   SELECT
			  movie_id,
			  movie_title,
			  movie_img,
			  movie_resume,
			  movie_genre
		   FROM movies 
		`);


	 
		db.end();
		
		res.render('index', {
		   'movies': movies,
		});

	}); //app.get('/'.. end)

	/*---------------------------------------------------- Index - end --------------------------------------------------*/

	/*-------------------------------------------------------- Info -----------------------------------------------------*/

	app.get('/info/:movie_id', async (req, res, next) => {

		let db = await mysql.connect();
		let [info] = await db.execute('SELECT * FROM movies');

		res.render('info', {
			'info': info
		});
		
		db.end();

	}); //app.get('/'.. end)

	/*------------------------------------------------------ Info end ---------------------------------------------------*/

	/*------------------------------------------------------ Info.v2 end ---------------------------------------------------*/

	// app.get('/infov2', async (req, res, next) => {

	// 	let db = await mysql.connect();
	// 	let [infov2] = await db.execute('SELECT * FROM movies');

	// 	res.render('infov2'
	// 		'infov2': infov2
	// 	);

	// 	db.end();

	// }); //app.get('/'.. end)

	/*------------------------------------------------------ Info.v2 end ---------------------------------------------------*/

	/*------------------------------------------------------ Contact ----------------------------------------------------*/

	app.get('/contact', async (req, res, next) => {

		let db = await mysql.connect();

		res.render('contact');
		
		db.end();

	}); //app.get('/'.. end)

	/*----------------------------------------------------- Contact end -------------------------------------------------*/

	app.post('/contact', async (req, res, next) => {

		let name = req.body.name;

		let surname = req.body.surname;

		let email = req.body.email;

		let subject = req.body.subject;

		let message = req.body.message;

		
		let return_message_h1 = "Something went wrong...";
		let return_message_h2 = "Check following:";

		let return_messages = [];


		//Variables to validate the different fields in the 'Contact' form

		const numbers = /^[0-9]+$/; //All the numbers from 0-9
		var atpos = email.indexOf("@"); //To check if the @ is placed correctly
	 	var dotpos = email.lastIndexOf("."); //To check if the last . is placed correctly


		// Check if 'name' has been filled out
		if (typeof name == 'undefined' || name == ''){
			return_messages.push('"Name" field has been left empty');
		} 

		// Check if 'name' contains any numbers
		if (name.match(numbers)){
			return_messages.push('"Name" field must not contain any numbers');
		}

		// Check if 'surname' has been filled out
		if (typeof surname == 'undefined' || surname == ''){
			return_messages.push('"Surname" field has been left empty');
		} 

		// Check if 'surname' contains any numbers
		if (surname.match(numbers)){
			return_messages.push('"Surname" field must not contain any numbers');
		}
		
		// Check if 'email' has been filled out
		if (typeof email == 'undefined' || email == ''){
			return_messages.push('"Email" field has been left empty');
		}

		// Check if the 'email' is valid
		if(atpos < 1 || dotpos < atpos + 2 || email.length <= dotpos + 2){
			return_messages.push('Please provide a valid "Email"');
		}

		// Check if 'subject' has been filled out
		if(typeof subject == 'undefined' || subject == ''){
			return_messages.push('"Subject" field has been left empty');
		}

		// Check if 'message' has been filled out
		if(typeof message == 'undefined' || message == ''){
			return_messages.push('"Message" field has been left empty');
		}

		// Don't send the message to the database if any of the above statements are true
		if(return_messages.length > 0){

			return_message_h1 = "Something went wrong...";
			return_message_h2 = "Check following:";

			res.render('contact', {
				'return_message_h1': return_message_h1,
				'return_message_h2': return_message_h2,
				'return_messages': return_messages,
				'values': req.body
			});

		// Send the message to the database
		}else if(return_messages.length == 0){

			let today = new Date();
			let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			let dateTime = date+' '+time;

			let db = await mysql.connect();

			let result = await db.execute(`
				INSERT INTO messages (
					message_name,
					message_surname,
					message_email,
					message_subject,
					message_message,
					message_date_time
				) 
				VALUES 
					(?, ?, ?, ?, ?, ?)`, [
						name,
						surname,
						email,
						subject,
						message,
						dateTime
					]
			);
		
			db.end();

			res.redirect('/contact');

		} // else if(...) END
		
	}); // app.post('/contact'...) END


} //module.exports END