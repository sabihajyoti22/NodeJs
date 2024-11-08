require("dotenv").config()
const express = require('express')
const userRouter = require("./Route/user.route")
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();
const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// CORS -> Cross Origin Resource Sharing (When websites are running in different ports)
app.use(cors.apply())

app.get("/",(req,res)=>{
    res.send(`<h1>Home page</h1>`)
})

app.use("/api", userRouter);

app.use((req,res,next)=>{
    res.send("<h1>404 Page Not Found</h1>")
})

app.listen(PORT,()=>{
    console.log(`Server is running at location http://localhost:${PORT}`);
})