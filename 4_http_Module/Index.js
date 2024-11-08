// HTTP Status Code
// 1. Informational response(100-199)
// 2. Successful response(200-299)
// 3. Redirect(300-399)
// 4. Client Error(400-499)
// 5. Server Error(500-599)


const http =  require("http")
const port = 3000;
const hostname = "127.0.0.1"

const mysServer = http.createServer((req,res)=>{
    // res.end("<h1>Hello I am new server</h1>")
    res.writeHead(202,{'Content-Type':'text/html'}) //Changing status code
    res.write("<h1>Hello I am new server</h1>") 
    res.end()
})

mysServer.listen(port,hostname, ()=>{
    console.log(`Server is running successfully at http://${hostname}:${port}`)
})
