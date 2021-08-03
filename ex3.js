#! /usr/bin/env node

"use strict";


// access the arguments passed to the program
var path = require("path");
var fs = require("fs");
var util = require("util");
var Transform = require("stream").Transform;
var CAF = require("caf");
var zlib = require("zlib");
var args = require("minimist")(process.argv.slice(2) ,{
	boolean: ["help","in","out","compress","decompress"],
	string: ["file"]
});



processFile = CAF(processFile);


// Enviroment Variables
var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname )
var OUTFILE =  path.join(BASE_PATH,"out.txt");

if(args.help){

	printHelp();

}else if(args.in || args._.includes("-")){

    let tooLong = CAF.timeout(12,"Took too long time");
    processFile(tooLong,process.stdin)
    .catch(error);

}else if (args.file){

	let stream = fs.createReadStream(path.join(BASE_PATH, args.file))	
	let tooLong = CAF.timeout(10,"Take too long time");
	processFile(tooLong,stream)
	.then(function(){console.log("Complete");})
	.catch(error);

}else{

	error("Incorrect usage.",true);

}


// ################################################

function *processFile(signal, inStream){
	var outStream = inStream;


	if(args.decompress){
    	let gunzibstream = zlib.createGunzip();
    	outStream = outStream.pipe(gunzibstream);
    }

	var upperStream = new Transform({
		transform(chunk, encode, next ){
			this.push(chunk.toString().toUpperCase());
			next(); // call it back
		}
	})
	
	outStream = outStream.pipe(upperStream);


    if(args.compress){
    	let gzibStream = zlib.createGzip();
    	outStream = outStream.pipe(gzibStream);
    	OUTFILE = `${OUTFILE}.gz`;
    }



	var targetStream;
	if(args.out){
		targetStream = process.stdout;
	}else{
		targetStream = fs.createWriteStream(OUTFILE);
	}
    
    outStream.pipe(targetStream);


	signal.pr.catch(function() {
		outStream.unpipe(targetStream);
		outStream.destroy();
	});

 	// listen to completeness of stram operation
    yield (function(stream){
    	return new Promise(function call(res){
    		stream.on("end",res);
    	});
    })(outStream); // immediate execution


}




function printHelp(){
	console.log("ex2 usage : ");
	console.log("");
	console.log("--help                print this help");
	console.log("--file={FILENAME}     process the file");
	console.log("--in , -              process stdin");
	console.log("--out                 process stdout");
	console.log("--compress            gzib the output")
	console.log("--decompress          un-gzib the input");
	console.log("");
}



function error(msg, includeHelp = false){
	console.error(msg);
	if(includeHelp){
		console.log("");
		printHelp();
	}

}











