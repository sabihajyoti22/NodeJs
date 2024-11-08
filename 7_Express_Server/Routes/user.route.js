const express = require("express")
const path = require("path")
const router = express.Router();
 
router.get("/register",(req,res)=>{
    res.statusCode = 200;
    let reqPath = path.join(__dirname, '../');
    res.sendFile(reqPath+"/Views/Register.html");
})

router.get("/login",(req,res)=>{
    res.statusCode = 200;
    let reqPath = path.join(__dirname, '../');
    res.sendFile(reqPath+"/Views/Login.html");
    res.cookie("name","Sabiha Nasrin Jyoti")
    res.cookie("cgpa","3.57");
    res.append("id","136");
})

module.exports = router