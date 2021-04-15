const router = require('express').Router();
const database = include('databaseConnection');
const Joi = require("joi");
//const dbModel = include('databaseAccessLayer');
//const dbModel = include('staticData');

// const userModel = include('models/web_user');
// const petModel = include('models/pet');

const crypto = require('crypto');
const {v4: uuid} = require('uuid');
const ObjectId = require('mongodb').ObjectId

const passwordPepper = "SeCretPeppa4MySal+";

router.get('/', async (req, res) => {
	console.log("page hit");
	try {
		// const users = await userModel.findAll({attributes: ['web_user_id','first_name','last_name','email']}); //{where: {web_user_id: 1}}
		const userCollection = database.db("lab_example").collection("users");
		const users = await userCollection.find().project({first_name: 1, last_name: 1, email: 1, _id: 1}).toArray();
		if (users === null) {
			res.render('error', {message: 'Error connecting to MongoDB'});
			console.log("Error connecting to userModel");
		}
		else {
			console.log(users);
			res.render('index', {allUsers: users});
		}
	}
	catch(ex) {
		res.render('error', {message: 'Error connecting to MongoDB'});
		console.log("Error connecting to MySQL");
		console.log(ex);
	}
});

router.get('/pets', async (req, res) => {
	console.log("page hit");
	try {
		const pets = await petModel.findAll({attributes: ['name']}); //{where: {web_user_id: 1}}
		if (pets === null) {
			res.render('error', {message: 'Error connecting to MySQL'});
			console.log("Error connecting to userModel");
		}
		else {
			console.log(pets);
			res.render('pets', {allPets: pets});
		}
	}
	catch(ex) {
		res.render('error', {message: 'Error connecting to MySQL'});
		console.log("Error connecting to MySQL");
		console.log(ex);
	}
});



router.get('/showPets', async (req, res) => {
	console.log("page hit");
	const petCollection = database.db("lab_example").collection("pets");
	try {
		let userId = req.query.id;
		const user = await userModel.findByPk(userId); 
		if (user === null) {
			res.render('error', {message: 'Error connecting to MongoDB'});
			console.log("Error connecting to userModel");
		}
		else {
			let pets = await user.getPets();
			console.log(pets);
			let owner = await pets[0].getOwner();
			console.log(owner);
			
			res.render('pets', {allPets: pets});
		}
	}
	catch(ex) {
		res.render('error', {message: 'Error connecting to MongoDB'});
		console.log("Error connecting to MySQL");
		console.log(ex);
	}
});

router.get('/deleteUser', async (req, res) => {
	const userCollection = database.db("lab_example").collection("users")
	try {
		console.log("delete user");
		console.log(req.id)

		let userId = req.query.id;
		if (userId) {
			console.log("userId: "+userId);
			let deleteUser = await userCollection.deleteOne({_id: ObjectId(userId)});
			console.log("deleteUser: ");
			console.log(deleteUser);
		}
		res.redirect("/");
	}
	catch(ex) {
		res.render('error', {message: 'Error connecting to MySQL'});
		console.log("Error connecting to MySQL");
		console.log(ex);	
	}
});

router.post('/addUser', async (req, res) => {
	console.log(req.body);

	const schema = Joi.object({
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
		email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
		first_name: Joi.string(),
		last_name: Joi.string()
	})

	const validationResult = schema.validate(req.body);

	if (validationResult.error != null) {
		console.log(validationResult.error);
		throw validationResult.error;
	}

	try {
		console.log("form submit");
		const userCollection = database.db("lab_example").collection("users");

		const password_salt = crypto.createHash('sha512');

		password_salt.update(uuid());
		
		const password_hash = crypto.createHash('sha512');

		password_hash.update(req.body.password+passwordPepper+password_salt);


		await userCollection.insertOne(
			{	
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				password_salt: password_salt.digest('hex'),
				password_hash: password_hash.digest('hex')
			}
		);
	
		res.redirect("/");
	}
	catch(ex) {
		res.render('error', {message: 'Error connecting to MongoDB'});
		console.log("Error connecting to MySQL");
		console.log(ex);	
	}
});

/*
router.get('/', (req, res) => {
	console.log("page hit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MySQL'});
			console.log("Error connecting to mysql");
			console.log(err);
		}
		else {
			
			dbModel.getAllUsers((err, result) => {
				if (err) {
					res.render('error', {message: 'Error reading from MySQL'});
					console.log("Error reading from mysql");
					console.log(err);
				}
				else { //success
					res.render('index', {allUsers: result});

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			dbConnection.release();
		}
	});
});
*/

/*
router.post('/addUser', (req, res) => {
	console.log("form submit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MySQL'});
			console.log("Error connecting to mysql");
			console.log(err);
		}
		else {
			console.log(req.body);
			dbModel.addUser(req.body, (err, result) => {
				if (err) {
					res.render('error', {message: 'Error writing to MySQL'});
					console.log("Error writing to mysql");
					console.log(err);
				}
				else { //success
					res.redirect("/");

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			
			dbConnection.release();
		}
	});

});
*/

/*
router.get('/deleteUser', (req, res) => {
	console.log("delete user");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MySQL'});
			console.log("Error connecting to mysql");
			console.log(err);
		}
		else {
			console.log(req.query);

			let userId = req.query.id;
			if (userId) {
				dbModel.deleteUser(userId, (err, result) => {
					if (err) {
						res.render('error', {message: 'Error writing to MySQL'});
						console.log("Error writing to mysql");
						console.log(err);
					}
					else { //success
						res.redirect("/");

						//Output the results of the query to the Heroku Logs
						console.log(result);
					}
				});
			}
			else {
				res.render('error', {message: 'Error on Delete'});
			}
		
			dbConnection.release();
		}
	});
});
*/

module.exports = router;
