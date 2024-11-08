const express = require("express")
const userRouter = require("./Routes/user.route")
const app = express()

app.use("/api/user", userRouter)

app.use("/", (req, res) => {
  res.statusCode = 200;
  res.sendFile(__dirname+"/Views/Home.html")
})

app.use((req, res) => {
    res.send("<h1>404 !!! Not a valid url</h1>");
  })

module.exports = app