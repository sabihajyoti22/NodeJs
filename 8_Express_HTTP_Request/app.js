const express = require("express");
const userRoute = require("./Routes/userRoute")
const app = express();

app.get("/",(req,res)=>{
    res.send("<h1>This is Home page</h1>")
})

// app.use("/api/students", userRoute)
app.use("/api/users", userRoute)

app.use((req, res) => {
    res.send("<h1>404 !!! Not a valid url</h1>");
})

module.exports = app