const Middlewares = (req, res, middlewareArray, cb) => {

    if (!Array.isArray(middlewareArray)) {
        throw Error('Internal No middleware array found.')
    }

    let i = 0

    const executeMiddleWare = i => {
        if (i === middlewareArray.length) {
            cb(null, req, res);
            return;
        };

        middlewareArray[i](req, res, (error) => {
            if (error) {
                cb(error);
            } else {
                i++
                executeMiddleWare(i)
            };
        })
    }

    executeMiddleWare(i)
}

module.exports = {
    Middlewares
}