#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var http = require("http");
var express = require("express");
var sqlite3 = require("sqlite3");
var staticAlias = require("node-static-alias");

var app = express();
// ************************************

const DB_PATH = path.join(__dirname,"my.db");
const WEB_PATH = path.join(__dirname,"web");
const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//   (comment out if sqlite3 not working for you)
var myDB = new sqlite3.Database(DB_PATH);
var SQL3 = {
	run(...args) {
		return new Promise(function c(resolve,reject){
			myDB.run(...args,function onResult(err){
				if (err) reject(err);
				else resolve(this);
			});
		});
	},
	get: util.promisify(myDB.get.bind(myDB)),
	all: util.promisify(myDB.all.bind(myDB)),
	exec: util.promisify(myDB.exec.bind(myDB)),
};


// *************************

async function getAllRecords() {
	var result = await SQL3.all(
		`
		SELECT
			Something.data AS "something",
			Other.data AS "other"
		FROM
			Something
			JOIN Other ON (Something.otherID = Other.id)
		ORDER BY
			Other.id DESC, Something.data
		`
	);

	return result;
}


//============================================================

app.get('/get-records', async (req, res)=>{
	const response = await getAllRecords();
	res.setHeader('Content-Type',"application/json");
	res.send(response);
	res.end();
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(HTTP_PORT, () => {
  console.log(`Example app listening at http://localhost:${HTTP_PORT}`)
})



