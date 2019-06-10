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
            const sql = `INSERT INTO \`users\` (
                \`user_name\`,
                \`password\`,
                \`firstname\`,
                \`lastname\`
                ) VALUES (
                ?,
                ?,
                ?,
                ?)`;
            try {
                const ok = await db.query(sql, user_name, hash, firstname, lastname);
                if(ok.insertId){
                    res.status(200).json({success: true, insertId: ok.insertId});
                } else {
                    res.status(500).json({success: true, error: ok.message});
                }
            } catch(e){
                res.status(500).json({success: false, error: e.toString()});
            }
          });
        }
});

app.patch('/api/users/:id', async (req, res) => {
    const users = await db.query("SELECT * FROM users WHERE user_id = ?", parseInt(req.params.id));
    if(users.length > 0){
        for(const key in users[0]){
            if(typeof req.body[key] === 'undefined'){
                req.body[key] = users[0][key];
            }
        }
        
        const {
            user_name,
            password,
            firstname,
            lastname
        } = req.body;

        const sql = `UPDATE users SET 
                user_name=?,
                \`password\`=?,
                firstname=?,
                lastname=?`;
        
        try{
            if(password !== users[0].password){
                bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
                    if(err){
                        res.status(500).json({success: false, error: err.toString()});
                    }
                    const ok = await db.query(sql, user_name, hash, firstname, lastname);
                    if(ok.insertId){
                        res.status(200).json({success: true, insertId: ok.insertId});
                    } else {
                        res.status(500).json({success: true, error: ok.message});
                    }
                });
            } else {
                const ok = await db.query(sql, user_name, password, firstname, lastname);
                if(ok.insertId){
                    res.status(200).json({success: true, insertId: ok.insertId});
                } else {
                    res.status(500).json({success: true, error: ok.message});
                }
            }
        } catch(e){
            res.status(500).json({success: false, error: e.toString()});
        }
    } else {
        res.status(404).json({success: true, results: []});
    }
});

app.get('/api/expenses/:limit/:offset', async (req, res) => {
    const expenses = await db.query("SELECT * FROM expense LIMIT ?, ?", parseInt(req.params.limit), parseInt(req.params.offset));
    if(expenses.length > 0){
        res.status(200).json({success: true, results: expenses});
    } else {
        res.status(404).json({success: true, results: []});
    }
});

app.get('/api/expenses/:id', async (req, res) => {
    const expenses = await db.query("SELECT * FROM expense WHERE user_id = ?", parseInt(req.params.id));
    if(expenses.length > 0){
        res.status(200).json({success: true, results: expenses});
    } else {
        res.status(404).json({success: true, results: []});
    }
});

app.post('/api/expenses', async (req, res) => {
    const {
        category,
        name,
        amount,
        notes
    } = req.body;

    if(category && name && amount && notes){
        const sql = `INSERT INTO \`expense\` (
            category,
            name,
            amount,
            notes
            ) VALUES (
            ?,
            ?,
            ?,
            ?)`;
        try {
            const ok = await db.query(sql, category, name, amount, notes);
            if(ok.insertId){
                res.status(200).json({success: true, insertId: ok.insertId});
            } else {
                res.status(500).json({success: true, error: ok.message});
            }
        } catch(e){
            res.status(500).json({success: false, error: e.toString()});
        }
    }
});

const server = app.listen( process.env.PORT || 8080, function () {

    const { address, port } = server.address();
    console.log(`Server listening at http://${address}:${port}`)
});