



/*
 
 
 Process is an Node object that connect to I/O sytem of POSIX interface  
 
 JavaScript is agnostic to I/O 

 we have 3 standard I/O streams ( stdout , stderr , stdin );


*/

// print a character string directly to some stream with a buffer 
process.stdout.write("hello vim from process stdout write \n");

// format it  ( more effectient )
console.log("hello vim from console log");  

// it redericts diffrently from console.log ( as example log files ) 
console.error("Oops an error");


// process.stdin.read()




