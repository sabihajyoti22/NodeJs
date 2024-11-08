require("dotenv").config()
const express = require("express");
const app = express();
const PORT = process.env.PORT

app.get("/",(req,res)=>{
    res.send("<h1>This is home page route</h1>")
})

app.listen(PORT,()=>{
    console.log(`Server is running at location http://localhost:${PORT}`)
})
