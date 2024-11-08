const os = require("os"); //Open-Source

console.log(os.userInfo());
console.log(os.homedir());
console.log(os.hostname());

console.log(os.totalmem());
console.log(os.freemem());

const path = require("path");

// const extensionName = path.extname("index.html")
// console.log(extensionName)

const join = path.join(__dirname + "/View")
console.log(join)
