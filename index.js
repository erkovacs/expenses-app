const express = require('express');
const db = require('./library/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 5;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/api/users/:limit/:offset', async (req, res) => {
    const users = await db.query("SELECT * FROM users LIMIT ?, ?", parseInt(req.params.limit), parseInt(req.params.offset));
    if(users.length > 0){
        res.status(200).json({success: true, results: users});
    } else {
        res.status(404).json({success: true, results: []});
    }
});

app.get('/api/users/:id', async (req, res) => {
    const users = await db.query("SELECT * FROM users WHERE user_id = ?", parseInt(req.params.id));
    if(users.length > 0){
        res.status(200).json({success: true, results: users});
    } else {
        res.status(404).json({success: true, results: []});
    }
});

app.post('/api/users', async (req, res) => {
    const {
        user_name,
        password,
        firstname,
        lastname
    } = req.body;

    if(user_name && password && firstname && lastname){
        bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
            if(err){
                res.status(500).json({success: false, error: err.toString()});
            }
            const sql = `INSERT INTO users (
                \`user_name\`,
                \`password\`,
                \`firstname\`,
                \`lastname\`,
                ) VALUES (
                ?,
                ?,
                ?,
                ?)`;
            try {
                console.log({sql, user_name, hash, firstname, lastname});
                const users = await db.query(sql, user_name, hash, firstname, lastname);
                console.log(users);
                // if(users.length > 0){
                //     res.status(200).json({success: true, results: users});
                // } else {
                //     res.status(404).json({success: true, results: []});
                // }
            } catch(e){
                res.status(500).json({success: false, error: e.toString()});
            }
          });
        }

});

const server = app.listen( process.env.PORT || 8080, function () {

    const { address, port } = server.address();
    console.log(`Server listening at http://${address}:${port}`)
});