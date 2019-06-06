const mysql = require('mysql');
const fs    = require('fs');

const config = JSON.parse( 
    fs.readFileSync( __dirname + "/../config/db.json", 'utf8')
);

let connection = mysql.createConnection(config);

let db = {};

db.connection = connection.connect();

db.query = function(str, ...params){
    return new Promise(function(resolve, reject) {
        connection.query(str, params, function (err, rows, fields) {
        if (err) throw err
            resolve(rows);
        })
    })
};

module.exports = db;