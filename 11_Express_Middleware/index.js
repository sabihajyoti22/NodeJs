const express = require("express");
const app = express();
const PORT = 3000;

const myMiddleware = (req,res,next)=>{
    console.log("Hi I am middleware");
    req.currentDate = new Date(Date.now());
    next();
}

app.use(express.static("public"))

// app.use(myMiddleware) //For public use

// app.get("/",myMiddleware,(req,res)=>{
//     console.log(`From middelware-> Current Date: ${req.currentDate}`)
//     res.send(`<h1>Hi i am home route</h1>`)
// })
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.listen(PORT,()=>{
    console.log(`Sercer is running at location http://localhost:${PORT}`)
})