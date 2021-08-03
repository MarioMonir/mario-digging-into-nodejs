#! /usr/bin/env node

"use strict";


var util = require("util");
var child_process = require("child_process");

// ========================================

const HTTP_PORT = 8093;
const MAX_CHILDREN = 5; 

const delay = util.promisify(setTimeout);

main().catch(console.error);

//=========================================


async function main(){
  
	console.log(`Load Testing http://localhsost:${HTTP_PORT}.... `);

	while(true){ 
	
 		process.stdout.write(`Sending  ${MAX_CHILDREN} requests .... `);
	
		let children = []

		for( let i = 0 ; i <  MAX_CHILDREN ; i++ ){	
			children.push(child_process.spawn("node",["ex7-child.js"]));

		}

		let responses = await children.map((child) => {
			return new Promise((res)=>{
				child.on("exit", (code) => {
				   code === 0 ? res(true) : res(false) 	
				});
			});
		});
		
		responses = await Promise.all(responses);
			
		if ( responses.filter(Boolean).length == MAX_CHILDREN ){
			console.log("Success !");
		}else{
			console.log("Failure !");
		}


		console.log("Success !");
		await delay(500);
	
	}


}

//==========================================

