const fs = require("fs");

// fs.writeFile("writeFile.txt", "Writing on file", (err)=>{
// fs.appendFile("appendFile.txt", ". New line added to append file", (err)=>{
// fs.readFile("appendFile.txt", "utf-8", (err,data)=>{
// fs.rename("newFile.txt", "renamedNewFile", (err)=>{
// fs.unlink("renamedNewFile", (err)=>{
fs.exists("renamedNewFile", (result)=>{
    if(result){
        console.log("found")
    }
    else{
        console.log("not found")
    }
})