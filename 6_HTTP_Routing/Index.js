const http = require("http")
const fs = require("fs")
const hostname = "127.0.0.1"
const port = "3000"

const myServer = http.createServer((req,res)=>{
    const handleReadFile = (statusCode, fileLocation) =>{
        fs.readFile(fileLocation,"utf-8",(err,data)=>{
            if(err){
                console.log(err.message);
            }
            else{
                res.writeHead(statusCode,{"Conteent-Type":"text/html"})
                res.write(data)
                res.end()
            }
        })
    }

    if(req.url === "/"){
        handleReadFile(200,"./View/home.html")
    }
    else if(req.url === "/About"){
        handleReadFile(200,"./View/about.html")
    }
    else if(req.url === "/Contact"){
        handleReadFile(200,"./View/contact.html")
    }
    else{
        handleReadFile(404,"./View/error.html") 
    }
})
myServer.listen(port,hostname, ()=>{
    console.log(`Server is running successfully at http://${hostname}:${port}`)
})