// const mysql = require('mysql2');

// const is_heroku = process.env.IS_HEROKU || false;

// const dbConfigHeroku = {
// 	host: "us-cdbr-east-03.cleardb.com",
// 	user: "b1ab7fb2ee03bc",
// 	password: "2a484a2d",
// 	database: "heroku_3d208ad4bd6f421",
// 	multipleStatements: false,
// 	namedPlaceholders: true
// };

// const dbConfigLocal = {
// 	host: "localhost",
// 	user: "root",
// 	password: "Password",
// 	database: "lab_example",
// 	multipleStatements: false,
// 	namedPlaceholders: true
// };

// if (is_heroku) {
// 	var database = mysql.createPool(dbConfigHeroku);
// }
// else {
// 	var database = mysql.createPool(dbConfigLocal);
// }

// module.exports = database;
		
const MongoClient = require("mongodb").MongoClient;

const is_heroku = process.env.IS_HEROKU || false;

const herokuURI = "mongodb+srv://johnnykung:tzuning615@clusterokewebsite.a4z3c.gcp.mongodb.net/lab_example?=true&w=majority";

const localURI = "mongodb://localhost:27017/?authSource=admin&retryWrites=true&w=majority"

let database;

if (is_heroku) {
	database = new MongoClient(herokuURI, { useNewUrlParser: true, useUnifiedTopology: true})
} else {
	database = new MongoClient(localURI, { useNewUrlParser: true, useUnifiedTopology: true})
}

module.exports = database;