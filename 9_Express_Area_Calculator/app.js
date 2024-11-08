const express = require("express");
const calculateRoutes = require("./Routes/useRoutes")
const app = express();

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/View/index.html")
})

app.use("/api/calculator", calculateRoutes)

app.use((req,res)=>{
    res.send("<h1>404!!! Page not found</h1>")
})

module.exports = app;