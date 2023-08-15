const http = require('http');
const routes = require('./routes/main');
const { Request } = require('./request');
const { Middlewares } = require('./middleware/main');
const { Response } = require('./response');

const server = http.createServer(IncomingRequest); // Creates the web server

/**
 * Main function that runs when a request hit the server
 * 
 * @param {object} req - Request object
 * @param {object} res - Response object 
 */
function IncomingRequest(req, res) {
    let routeFound = false;

    res = Response(res); // Creating new request object with additinal functions

    routes.urlSplit(req);

    for (const index in routes.routes) {

        if (routes.isMatching(req, routes.routes[index].route) && req.method === routes.routes[index].method && routes.parseUrlData(req, routes.routes[index].route)) {
            routeFound = true;

            routes.getSearchParams(req);
            break;
        };
    };

    if (routeFound === false) {
        console.log("not found paths");
        res.send(404, "Path not found");
    };
};

/**
 * Validate if the request has met the server requirements and executes middlewareExe function if specified route index 
 * hasMiddleware defined or callback function of sepcified route
 * 
 * @param {number} index - Accepted route array index
 * @param {object} req - Request object
 * @param {object} res - Response object 
 */
function requestExe(index, req, res) {
    Request(req, (error) => {
        if (error) {
            res.send(error.status, error.message);
        };
        if (routes.routes[index].hasMiddleWare) {
            middlewareExe(index, req, res);
        } else {
            callbackExe(index, req, res);
        };
    });
};

/**
 * Executes middlewares functions of specified route 
 * 
 * @param {number} index - Accepted route array index
 * @param {object} req - Request object
 * @param {object} res - Response object 
 */
function middlewareExe(index, req, res) {
    Middlewares(req, res, routes.middlewares[index], async (error) => {
        if (error) {
            console.log(error);
            res.send(error.status, error.message);
        } else {
            callbackExe(index, req, res);
        };
    });
};

/**
 * Executes callback function of specified route
 * 
 * @param {number} index - Accepted route array index
 * @param {object} req - Request object
 * @param {object} res - Response object
 */
function callbackExe(index, req, res) {
    routes.callbacks[index](req, res, (error, response) => {
        if (error) {
            console.log(error);
            res.send(error.status, error.message);
        } else {
            res.send(response.status, response.message);
        };
    });
};

/**
 * Start the server on the given port
 * 
 * @param {number|string} port - Port that the server need run on
 * 
 * @callback cb 
 */
function listen(port, cb) {
    server.listen(port, cb)
};

module.exports = {
    listen
}