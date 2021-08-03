#! /usr/bin/env node

"use strict";


// access the arguments passed to the program
var util = require("util");
var path = require("path");
var fs = require("fs");
var getStdin = require("get-stdin");
var args = require("minimist")(process.argv.slice(2) ,{
	boolean: ["help","in"],
	string: ["file"]
});


var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname )



if(args.help){
	printHelp();
}else if(args.in || args._.includes("-")){
	getStdin().then(processFile).catch(error);	
}else if (args.file){
	fs.readFile(path.join(BASE_PATH, args.file), function onContent(err,content){
		if(err){
			error(err.toString())
		}else{
			processFile(content.toString())
		}
	});
}else{
	error("Incorrect usage.",true);
}



// **********************

function processFile(content){
	content = content.toUpperCase();
	process.stdout.write(content);
}




function printHelp(){
	console.log("ex2 usage : ");
	console.log("");
	console.log("--help                print this help");
	console.log("--file={FILENAME}     process the file");
	console.log("--in , -              process stdin");
	console.log("");
}



function error(msg, includeHelp = false){
	console.error(msg);
	if(includeHelp){
		console.log("");
		printHelp();
	}

}











