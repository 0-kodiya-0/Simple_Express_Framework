# MyExpressServer

A lightweight, custom Express.js-like server framework built from scratch using Node.js core modules.

## Overview

MyExpressServer is a minimalist web framework that provides essential HTTP server functionality including routing, middleware support, request/response handling, and basic security features. It's designed to be simple, lightweight, and educational.

## Features

- **HTTP Methods**: Support for GET, POST, PUT, and DELETE requests
- **Routing**: Dynamic route matching with URL parameters (`:param`)
- **Middleware**: Chainable middleware functions for request processing
- **Request Parsing**: Automatic parsing of JSON and multipart form data
- **Response Helpers**: Built-in status codes and response utilities
- **Security**: Request validation (URL length, body size, content-type)
- **Error Handling**: Comprehensive error handling throughout the request lifecycle

## Quick Start

```javascript
const { Server, Routes } = require('myexpressserver');

// Define routes
Routes.Get('/', (req, res, next) => {
    try {
        next(null, { status: 200, message: 'Hello World!' });
    } catch (error) {
        next(error);
    }
});

// Start server
Server.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## API Reference

### Server
- `Server.listen(port, callback)` - Start the server on specified port

### Routes
- `Routes.Get(path, ...middlewares, callback)` - Define GET route
- `Routes.Post(path, ...middlewares, callback)` - Define POST route  
- `Routes.Put(path, ...middlewares, callback)` - Define PUT route
- `Routes.Delete(path, ...middlewares, callback)` - Define DELETE route

### Route Parameters

```javascript
// URL parameters
Routes.Get('/users/:id/posts/:postId', (req, res, next) => {
    console.log(req.urlParams.id);     // Access user ID
    console.log(req.urlParams.postId); // Access post ID
    next(null, { status: 200, message: 'Success' });
});

// Query parameters
Routes.Get('/search', (req, res, next) => {
    console.log(req.searchParams.q); // ?q=searchterm
    next(null, { status: 200, message: 'Search results' });
});
```

### Middleware

```javascript
// Authentication middleware
const authMiddleware = (req, res, next) => {
    try {
        // Validate user authentication
        if (!req.headers.authorization) {
            throw { status: 401, message: 'Unauthorized' };
        }
        next(); // Continue to next middleware or route handler
    } catch (error) {
        next(error); // Pass error to error handler
    }
};

// Use middleware in routes
Routes.Get('/protected', authMiddleware, (req, res, next) => {
    next(null, { status: 200, message: 'Protected resource' });
});
```

### Request Object

The request object includes:
- `req.url` - Request URL path
- `req.method` - HTTP method
- `req.headers` - Request headers
- `req.body` - Parsed request body (POST/PUT)
- `req.urlParams` - URL parameters object
- `req.searchParams` - Query parameters object

### Response Object

```javascript
const { Response } = require('myexpressserver');

Routes.Get('/example', (req, res, next) => {
    // Set headers
    res.setHeader('Content-Type', 'application/json');
    
    // Set cookies
    res.setCookie('sessionId=abc123; HttpOnly');
    
    // Redirect
    res.redirect('/new-location');
    
    // Send response
    next(null, { status: 200, message: 'Success' });
});
```

## File Structure

```
src/
├── server.js      # Main server logic and request handling
├── routes.js      # Route definition and URL matching
├── request.js     # Request parsing and validation
├── response.js    # Response utilities and status codes
└── middleware.js  # Middleware execution logic
```

## Content Type Support

- `application/json` - JSON data
- `multipart/form-data` - Form data with file uploads
- `image/jpeg` - JPEG images
- `image/png` - PNG images

## Security Features

- **URL Length Validation**: Maximum 70 characters
- **Body Size Validation**: Maximum 1000 bytes
- **Content-Type Validation**: Only allowed content types accepted
- **Method Validation**: Only GET, POST, PUT, DELETE allowed

## Error Handling

The framework includes comprehensive error handling:

```javascript
Routes.Post('/users', (req, res, next) => {
    try {
        // Your logic here
        if (!req.body.name) {
            throw { status: 400, message: 'Name is required' };
        }
        next(null, { status: 201, message: 'User created' });
    } catch (error) {
        next(error); // Framework handles the error response
    }
});
```

## Examples

### Basic REST API

```javascript
const { Server, Routes } = require('myexpressserver');

// Get all users
Routes.Get('/users', (req, res, next) => {
    next(null, { status: 200, message: 'All users' });
});

// Get user by ID
Routes.Get('/users/:id', (req, res, next) => {
    const userId = req.urlParams.id;
    next(null, { status: 200, message: `User ${userId}` });
});

// Create user
Routes.Post('/users', (req, res, next) => {
    const userData = JSON.parse(req.body);
    next(null, { status: 201, message: 'User created' });
});

// Update user
Routes.Put('/users/:id', (req, res, next) => {
    const userId = req.urlParams.id;
    const userData = JSON.parse(req.body);
    next(null, { status: 200, message: `User ${userId} updated` });
});

// Delete user
Routes.Delete('/users/:id', (req, res, next) => {
    const userId = req.urlParams.id;
    next(null, { status: 200, message: `User ${userId} deleted` });
});

Server.listen(3000, () => {
    console.log('API server running on port 3000');
});
```

## Dependencies

- `fast-json-stringify`: Fast JSON serialization
- `mongoose`: MongoDB object modeling (optional)

## License

MIT

## Author

Sanithu Jayakody
