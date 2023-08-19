const StatusCodes = {
  // Information responses
  100: "Continue", // Continue
  101: "Switching Protocols", // Switching Protocols
  102: "Processing", // Processing
  103: "Early Hints", // Early Hints

  // Successfull responses
  200: "OK", // OK
  201: "Created", // Created
  202: "Accepted", // Accepted
  203: "Non-Authoritative Information", // Non-Authoritative Information
  204: "No Content", // No Content
  205: "Reset Content", // Reset Content
  206: "Partial Content", // Partial Content
  207: "Multi-Status", // Multi-Status
  208: "Already Reported", // Already Reported 
  226: "IM Used", // IM Used 

  // Redirect responses
  300: "Multiple Choices", // Multiple Choices
  301: "Moved Permanently", // Moved Permanently
  302: "Found", // Found
  303: "See Other", // See Other
  304: "Not Modified", // Not Modified
  307: "Temporary Redirect", // Temporary Redirect
  308: "Permanent Redirect", // Permanent Redirect

  // Client errors responses
  400: "Bad Request", // Bad Request
  401: "Unauthorized", // Unauthorized
  402: "Payment Required", // Payment Required
  403: "Forbidden", // Forbidden
  404: "Not Found", // Not Found
  405: "Method Not Allowed", // Method Not Allowed
  406: "Not Acceptable", // Not Acceptable
  407: "Proxy Authentication Required", // Proxy Authentication Required
  408: "Request Timeout", // Request Timeout
  409: "Conflict", // Conflict
  410: "Gone", // Gone
  411: "Length Required", // Length Required
  412: "Precondition Failed", // Precondition Failed
  413: "Payload Too Large", // Payload Too Large
  414: "URI Too Long", // URI Too Long
  415: "Unsupported Media Type", // Unsupported Media Type
  416: "Range Not Satisfiable", // Range Not Satisfiable
  417: "Expectation Failed", // Expectation Failed
  418: "I'm a teapot", // I'm a teapot
  421: "Misdirected Request", // Misdirected Request
  422: "Unprocessable Content", // Unprocessable Content
  423: "Locked", // Locked 
  424: "Failed Dependency", // Failed Dependency 
  425: "Too Early", // Too Early
  426: "Upgrade Required", // Upgrade Required
  428: "Precondition Required", // Precondition Required
  429: "Too Many Requests", // Too Many Requests
  431: "Request Header Fields Too Large", // Request Header Fields Too Large
  451: "Unavailable For Legal Reasons", // Unavailable For Legal Reasons

  // Server errors
  500: "Internal Server Error", // Internal Server Error
  501: "Not Implemented", // Not Implemented
  502: "Bad Gateway", // Bad Gateway
  503: "Service Unavailable", // Service Unavailable
  504: "Gateway Timeout", // Gateway Timeout
  505: "HTTP Version Not Supported", // HTTP Version Not Supported
  506: "Variant Also Negotiates", // Variant Also Negotiates
  507: "Insufficient Storage", // Insufficient Storage
  508: "Loop Detected", // Loop Detected
  510: "Not Extended", // Not Extended
  511: "Network Authentication Required",  // Network Authentication Required
}

// const fastJson = require("fast-json-stringify");

// const mongooseErrorStringify = fastJson(({
//   title: "MongooseError",
//   type: "object",
//   properties: {
//     name: {
//       type: "string"
//     },
//     message: {
//       type: "string"
//     },
//     kind: {
//       type: "string"
//     },
//     path: {
//       type: "string"
//     }
//   }
// }));

/**
 * Main class for Sending error in a http response for the client 
 * 
 * @param {number} status - Statuscode
 * @param {object|string|undefined} message - Response message
 * @returns {object|string} - { status: number , message : object || string }
 */
function ResponseMessageCreate(status, message) {
  if (typeof status !== "number") {
    throw new TypeError("status need to be number");
  };
  message = { status: status, message: typeof message === "undefined" ? StatusCodes[status] : message };
  return message;
};

function ok(message) {
  return ResponseMessageCreate(200, message);
};

function contentMoved(message) {
  return ResponseMessageCreate(201, message);
};

function forbiddenError(message) {
  return ResponseMessageCreate(403, message);
};

function notFoundError(message) {
  return ResponseMessageCreate(404, message);
};

function notAccptedError(message) {
  return ResponseMessageCreate(406, message);
};

function tooManyRequestsError(message) {
  return ResponseMessageCreate(429, message);
};

function serverError(message) {
  return ResponseMessageCreate(500, message);
};

function insufficientStorageError(message) {
  return ResponseMessageCreate(507, message);
};

const Response = res => {
  return {
    ...res,
    setHeader: (key, value) => {
      res.setHeader(key, value)
    },
    setCookie: (cookie) => {
      res.setHeader("Set-Cookie", cookie);
    },
    redirect: (location) => {
      res.setHeader("Location", location);
    },
    send: (status, text) => {
      if (StatusCodes[status]) {
        res.statusCode = status;
        if (text === undefined) {
          res.write(ResponseMessageCreate(status).message);
        } else {
          if (typeof text === "string") { // Text need to be in a string
            res.write(text)
          } else {
            res.write(serverError().message);
          };
        };
        res.end();
      } else if (status === "piped") {
        return;
      } else {
        res.write(serverError().message);
        res.end();
      };

      console.log(text);

      delete res // Deleting the response object
    }
  };
}

module.exports = {
  Response, StatusCodes,
  ResponseMessageCreate, ok, contentMoved, forbiddenError, notFoundError, notAccptedError, tooManyRequestsError, serverError, insufficientStorageError
}