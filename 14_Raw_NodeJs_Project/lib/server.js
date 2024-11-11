/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sabiha Nasrin Jyoti
 * Date: 24/10/2024
 *
 */
// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');

// app object - module scaffolding
const server = {};

// create server
server.createServer = () => {
  http.createServer(server.handleReqRes).listen(environment.port, () => {
    console.log(`Server is running on ${environment.port}`);
  });
};

// handle Request Response
server.handleReqRes = handleReqRes;

// start the server

server.init = () => {
  server.createServer();
};

module.exports = server;
