
/**
 * Extract the search parameters from the request body
 * 
 * @param {object} req - Request object 
 */
function getSearchParams(req) {
    if (req.searchParams) {
        const keyValues = req.searchParams.split("&");
        req.searchParams = {};

        for (let i = 0; i < keyValues.length; i++) { // Adding search parameters to obj
            const element = keyValues[i].split("=");
            req.searchParams[element[0]] = element[1];
        };
    };
};

/**
 * Extract the sub paths value from the request url (/path/:subPath/path)
 * 
 * @param {object} req - Request object
 * @param {string} route - A defined route 
 * @returns {boolean}
 */
function parseUrlData(req, route) {
    const routeSplit = route.split('/');

    req.urlParams = {}
    if (routeSplit.length !== req.url.length) {
        return false;
    };
    routeSplit.forEach((segment, index) => {
        if (segment.indexOf(':') === 0) {
            const key = segment.split(":")
            const value = req.url[index]
            req.urlParams[key[1]] = value
        }
    });

    return true;
};

/**
 * Checks if the url match with given route
 * 
 * @param {object} req - Request object 
 * @param {string} route - A defined route
 * @returns {boolean}
 */
function isMatching(req, route) {
    // required URL structure
    // /user/:id/comment/:comment

    let forStart = 0;
    req.admin = false; // When True the request is identified as an admin request otherwise a normal request

    const urlSplit = req.url.split('/');
    urlSplit[0] = "/";

    req.url = urlSplit;

    if (urlSplit[0] === "admin") {
        req.admin = true;
        forStart = 1
    };

    const routeSplit = route.split('/');
    routeSplit[0] = "/";

    for (let index = forStart; index < routeSplit.length; index++) {
        if (routeSplit[index][0] === ':') {
            if (typeof urlSplit[index] === "undefined") {
                return false;
            };
        } else {
            if (routeSplit[index] !== urlSplit[index]) {
                return false;
            };
        };
    };

    return true;
};

/**
 * Splits the search parameter and the url
 * 
 * @param {object} req - Request object 
 */
function urlSplit(req) {
    const urlData = req.url.split("?"); // removing search parameters from the url
    req.url = urlData[0];
    req.searchParams = urlData[1];
};

const tokenAccessTypes = ["basic", "personal", "work", "student", "admin", "server", "session"];
const tokenAccess = [];
const accessFors = [];
const routes = [];
const callbacks = [];
const middlewares = [];

// Methods that server accpects

/**
 * 
 * @param {string|Array} tokenAccess - Define Token access for paths
 * @param {string} accessFor - Admin will only allow admins , NotAdmin will only allow not admins , Both will allow both admins and not admins
 * @param {string} pathName - A path that the server can accpet
 * @param {Function} Middleware  - Middleware functions that executes before the callback
 * @param {Function} callback - Callback function for executing after the middleware have finished executing
 * 
 * @param {string} method - Method that the path belong to
 */
function MethodMain(args, method) {
    let route, tAccess, accessFor, middleware = [], callback

    if (typeof args[0] === "string") {
        if (args[0] !== "All") {
            for (let i = 0; i < tokenAccessTypes.length; i++) {
                if (args[0] === tokenAccessTypes[i]) {
                    break;
                } else if (args[0] !== tokenAccessTypes[i] && i === tokenAccessTypes.length - 1) {
                    throw new TypeError("...args[0] value " + args[0] + " not accepted");
                };
            };
        } else {
            args[0] = tokenAccessTypes;
        };
    } else if (Array.isArray(args[0])) {
        if (args[0].length <= tokenAccessTypes.length) {
            args[0].forEach((argsV) => {
                let found = false;
                for (let i = 0; i < tokenAccessTypes.length; i++) {
                    if (argsV === tokenAccessTypes[i]) {
                        found = true;
                        break;
                    };
                };
                if (found === false) {
                    throw new TypeError("...args[0] value " + argsV + " not accepted");
                };
            });
        } else {
            throw new TypeError("...args[0] can only maximum 3 values");
        };
    } else {
        throw new TypeError("...args[0] need to be string or array");
    };

    if (typeof args[1] !== "string") {
        throw new TypeError("...args[1] need to be string");
    };
    if (args[1] !== "notadmin" && args[1] !== "admin" && args[1] !== "both") {
        throw new TypeError("...args[1] value not valid");
    };
    if (typeof args[2] !== "string") {
        throw new TypeError("...args[2] need to be string");
    };
    if (typeof args[args.length - 1] !== "function") {
        throw new TypeError("...args[...args.length - 1] need to be function");
    };

    if (args.length === 4) {
        tAccess = args[0];
        accessFor = args[1];
        route = args[2];
        callback = args[3];
    } else if (args.length > 4) {
        tAccess = args[0];
        accessFor = args[1];
        route = args[2];
        callback = args[args.length - 1]
        for (let i = 3; i < args.length - 1; i++) {
            if (typeof args[i] !== "function") {
                throw new TypeError(`...args[${i}] need to be function`);
            };
            middleware.push(args[i]);
        };
    };

    tokenAccess.push(tAccess);
    accessFors.push(accessFor);
    routes.push({
        route,
        hasMiddleWare: middleware.length !== 0,
        method: method
    });
    callbacks.push(callback)
    middlewares.push(middleware);
};

function Get(...args) {
    MethodMain(args, "GET");
};
function Post(...args) {
    MethodMain(args, "POST");
};
function Put(...args) {
    MethodMain(args, "PUT");
};
function Delete(...args) {
    MethodMain(args, "DELETE");
};

module.exports = {
    isMatching, parseUrlData, getSearchParams, urlSplit,
    tokenAccessTypes, tokenAccess, accessFors, routes, middlewares, callbacks,
    Get, Post, Put, Delete
}