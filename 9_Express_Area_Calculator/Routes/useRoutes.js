const express = require("express");
const path = require("path");
const bodyParser = require("body-parser")
const router = express.Router();

const reqPath = path.join(__dirname,"../") 

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get("/triangle",(req,res)=>{
    res.sendFile(reqPath+"/View/triangle.html")
})

router.get("/circle",(req,res)=>{
    res.sendFile(reqPath+"/View/circle.html")
})

router.post("/triangle",(req,res)=>{
    const height = req.body.height;
    const base = req.body.base;
    const area = 0.5*height*base;
    res.send(`<h1>Area of a Triangle: ${area}</h1>`)
})

router.post("/circle",(req,res)=>{
    const radious = req.body.radious;
    const area = Math.PI* radious*radious;
    res.send(`<h1>Area of a Circle: ${area}</h1>`)
})

module.exports = router