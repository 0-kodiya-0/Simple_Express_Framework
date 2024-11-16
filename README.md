# MyExpressServer
A Simple custom express server framework

# Notes
index.js - Main file
src/request.js - Logic for handling the request object
src/response.js - Logic for handling the response object
src/server.js - Logic that runs in every request combination with the src/response.js and src/request.js files

src/routes/main - Functions that is used define the server routes
src/middleware/main - Function that executes when a middleware is given for a route

# Api

src/routes file has all functions for GET, POST, DELETE, PUT

If you defining a function you need to add the pathName first all the middleware in the middle and the callback at last.
can you the function without middlewares

Example :- GET(pathName, middlewares .... , callback)

When calling the callback and middleware functions please call next function. next function will not be called automattically. And
if you have error please catch it with a try catch block and pass it to the next function in the middleware function

Example :- GET(pathName, (req, res, next) => {
    ** middleware function **
    try {
        **** your code ****
        next()
    } catch (error) {
        next(error)
    }
}, (req, res, next) =>{
** callback function **
    try {
        **** your code ****
        next()
    } catch (error) {
        next(error)
    }
})
