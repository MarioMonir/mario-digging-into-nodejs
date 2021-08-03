#! /usr/bin/env node

"use strict";


var fetch = require("node-fetch"); 


// ========================================

main().catch(console.error);

//=========================================


async function main(){

try{

	var res = await fetch("http://localhost:8039/get-records");
	if(res && res.ok){
		let records = await res.json();
		if (records && records.length > 0){
			process.exitCode = 0
			return;
		}
	}

}catch(err){
	console.error(err)
}

process.exitCode = 1;

}

//==========================================

