const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObj = parsedURL.query;
    const headersObj = req.headers;

    const requestProperties = {
        parsedURL,
        path,
        trimmedPath,
        method,
        queryStringObj,
        headersObj,
    };

    const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);

        choosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
