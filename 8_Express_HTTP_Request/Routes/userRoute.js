const express = require("express")
const path = require("path")
const router = express.Router();
const bodyParser = require("body-parser")

router.get("/student/userId/:id/userName/:name",(req,res)=>{
    // const {id, name} = req.query //Using Query Parameter
    const id = req.params.id; //Route Parameters
    const name = req.params.name; //Route Parameters
    res.send(`<h1>Student id: ${id} and name: ${name}</h1>`);
})

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())

// router.post("/user",(req,res)=>{
//     const id = req.body.id;
//     const name = req.body.name
//     res.send(`User id: ${id} and name: ${name}`);
// })

router.get("/register",(req,res)=>{
    const reqPath = path.join(__dirname,"../");
    res.sendFile(reqPath+"/Views/register.html")
})

router.post("/register",(req,res)=>{

    const id = req.body.id
    const name = req.body.fullName // Form Data

    res.send(`<h1>User id: ${id} and name: ${name} </h1>`);
})

module.exports = router;