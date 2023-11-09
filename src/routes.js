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
    } else {
        req.searchParams = {}; // To make handling error is other funtions easy
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
    if (routeSplit.length !== req.url.split("/").length) {
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
    if (typeof req.url !== "string") {
        return false
    };
    const urlSplit = req.url.split('/');
    urlSplit[0] = "/";
    const routeSplit = route.split('/');
    routeSplit[0] = "/";
    for (let index = 0; index < routeSplit.length; index++) {
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

const routes = [];
const callbacks = [];
const middlewares = [];

// Methods that server accpects

/**
 * 
 * @param {string} pathName - A path that the server can accpet
 * @param {Function} middleware  - Middleware functions that executes before the callback
 * @param {Function} callback - Callback function for executing after the middleware have finished executing
 * 
 * @param {string} method - Method that the path belong to
 */
function MethodMain(args, method) {
    let route, middleware = [], callback
    if (typeof args[0] !== "string") {
        throw new TypeError("...args[1] need to be string");
    };
    if (typeof args[args.length - 1] !== "function") {
        throw new TypeError("...args[...args.length - 1] need to be function");
    };
    if (args.length === 2) {
        route = args[0];
        callback = args[1];
    } else if (args.length > 2) {
        route = args[0];
        callback = args[args.length - 1];
        for (let i = 1; i < args.length - 1; i++) {
            if (typeof args[i] !== "function") {
                throw new TypeError(`...args[${i}] need to be function`);
            };
            middleware.push(args[i]);
        };
    };
    routes.push({
        route,
        hasMiddleWare: middleware.length !== 0,
        method: method
    });
    callbacks.push(callback)
    middlewares.push(middleware);
};

/**
 * Runs when request has GET method
 * 
 * @param  {...any} args (routeName, middleWares.... , callBack)
 */
function Get(...args) {
    MethodMain(args, "GET");
};

/**
 * Runs when request has POST method
 * 
 * @param  {...any} args (routeName, middleWares.... , callBack)
 */
function Post(...args) {
    MethodMain(args, "POST");
};

/**
 * Runs when request has PUT method
 * 
 * @param  {...any} args (routeName, middleWares.... , callBack)
 */
function Put(...args) {
    MethodMain(args, "PUT");
};

/**
 * Runs when request has DELETE method
 * 
 * @param  {...any} args (routeName, middleWares.... , callBack)
 */
function Delete(...args) {
    MethodMain(args, "DELETE");
};

module.exports = {
    isMatching, parseUrlData, getSearchParams, urlSplit,
    routes, middlewares, callbacks,
    Get, Post, Put, Delete
}