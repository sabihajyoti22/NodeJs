/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sabiha Nasrin Jyoti
 * Date: 24/10/2024
 *
 */
// dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// app object - module scaffolding
const app = {};

app.init = () => {
  server.init();
  worker.init();
};

app.init();
