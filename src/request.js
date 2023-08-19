const { notFoundError } = require("./response");

/**
 * Extracts form data from the request body
 * 
 * @param {object} req - Request object 
 * @returns {object}
 * 
 * @callback cb
 */
function extractMultiformData(req, cb) {
    try {
        let body = req.body.replace(/\r/g, "").replace(/\n/g, "").replace(/\s/g, "");
        const boundary = req.headers["content-type"][1].trim().replace("boundary=", "");
        body = body.split(boundary);
        req.body = {};
        body.forEach(element => {
            if (element !== "--") {
                const keyString = element.split(";")[1].replaceAll("--", "").replace("name=", "").split('"');
                req.body[keyString[1]] = keyString[2];
            };
        });
        cb();
    } catch (error) {
        cb(error);
    };
};

/**
 * Validates the server accepted url length
 * 
 * @param {string} url - Request url 
 */
function urlLenCheck(url) {
    if (url.length > 70) {
        throw { status: 414 };
    };
};

/**
 * Validates the server accepted body length
 * 
 * @param {string} body - Request body string 
 */
function bodyLenCheck(body) {
    if (body.length > 1000) {
        throw { status: 413 };
    };
};

/**
 * Validates the server accepted methods
 * 
 * @param {string} method - Request method 
 * @returns {boolean}
 * 
 * @throws (405)
 */
function canHaveBodyCheck(method) {
    switch (method) {
        case "GET":
            return false;
        case "POST":
            return true;
        case "PUT":
            return true;
        case "DELETE":
            return false;
        default:
            throw { status: 405 };
    };
};

/**
 * 
 * @param {object} req - Request object
 * @param {Function} extractFunc - Body data extrating function
 * 
 * @callback cb 
 */
function createBody(req, extractFunc, cb) {
    req.body = "";  // Creating body variable
    req.on('data', chunk => {  // Extracting the body
        try {
            bodyLenCheck(req.body);
            req.body += chunk.toString();
        } catch (error) {
            cb(error);
        };
    }).on('end', () => {
        if (extractFunc) {
            extractFunc(req, (error) => {
                if (error) {
                    cb(error);
                } else {
                    cb();
                };
            });
        } else {
            cb();
        };
    });
};

/**
 * Extract the body information from the request object
 * 
 * @param {object} req - Request object
 * @returns {null}
 * 
 * @callback cd
 *   
 */
function contentTypeAllowedCheck(req, cb) {
    if (typeof req.headers["content-type"] !== "string") {
        throw notFoundError("Header content-type not found");
    };
    req.headers["content-type"] = req.headers["content-type"].split(";");
    switch (req.headers["content-type"][0]) {
        case "application/json":
            createBody(req, undefined, cb);
            break;
        case "multipart/form-data":
            createBody(req, extractMultiformData, cb);
            break;
        case "image/jpeg":
            cb();
            break;
        case "image/png":
            cb();
            break;
        default:
            throw { status: 415 };
    };
};

/**
 * Main function that runs when a request hits the server
 * 
 * @param {object} req - Request object
 * 
 * @callback cb 
 */
const Request = (req, cb) => {
    req.on('error', (error) => { // for handling errors
        cb(error);
    });
    try {
        urlLenCheck(req.url);
        if (canHaveBodyCheck(req.method)) { // when we send images we don't want it to be equal to a string we will use res.pipe
            contentTypeAllowedCheck(req, cb);
        } else {
            cb();
        };
    } catch (error) {
        cb(error);
    };
};

module.exports = {
    Request, extractMultiformData
}