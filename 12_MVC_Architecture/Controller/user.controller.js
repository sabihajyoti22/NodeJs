const path = require("path");
const users = require("../Model/user.model");

exports.getUser = (req,res)=>{
    res.sendFile(path.join(__dirname+"/../View/user.html"))
}
exports.postUser = (req,res)=>{
    const id = Number(req.body.id);
    const name = req.body.name;

    const user = {id,name};
    users.push(user);
    res.status(201).json({
        success: true,
        users,
    });
    // console.log(name)
    // res.send("Hii there")
}