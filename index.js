let express = require('express');
let db = require('./library/db');

let app = express();

let server = app.listen( process.env.PORT || 8080, function () {

    let { address, port } = server.address();
    console.log("Server listening at http://%s:%s", address, port)
});