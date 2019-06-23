//required packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');


const app = express();
const port = 8080;
const secret = "secret";

app.use(cors());
app.use(bodyParser.json());


//Used during deployment

// const db = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
// })


//Used for development

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    database: 'jobs',
    password: '',
})

db.connect(err => {
    if (err) 
        console.log(err)
    else
        console.log('Connected to database')
});

app.get('/', (req, res) => {
    db.query(`SELECT * FROM USERS`, (error, results) => {
        if (error)
            res.send("error")
        else
            res.send(results)
    })
    // res.sendFile(root + 'index.html');
});

//Sign in request
app.post('/signin', (req, res) => {
    db.query(`SELECT * FROM USERS WHERE PHONE_NO='${req.body.phoneNumber}' AND PASSWORD='${req.body.password}'`, (error, results) => {
        if(error){
            res.status(400).send(false);
        }
        else if(results.rowCount === 0){
            res.status(400).send(false);
        }
        else{
            jwt.sign(req.body, secret, function(err, token) {
                res.status(200).send({token});
            });            
        }
      })
});

//Sign up request
app.post('/signup',(req, res) => {
    db.query(`INSERT INTO USERS VALUES ('${req.body.name}','${req.body.password}',${req.body.phoneNumber})`,(error,results) => {
        if(error){
            console.log(error);
            res.send(false);
        }
        else{
            jwt.sign(req.body, secret, function(err, token) {
                res.status(200).send({token});
            });
        }
    })    
})

//Home request
app.post('/home',(req,res) => {
    jwt.verify(req.headers.authorization, secret, (err, decoded) => {
        if(decoded){
            var body = [];
            db.query(`SELECT * FROM JOB_LIST`,(error,results) => {
                body.push(results);
            })   
            db.query(`SELECT * FROM APPLIED WHERE PHONE_NO = ${decoded.phoneNumber}`, (error, results) => {
                body.push(results);
                res.send(body)
            })         
        }
        else if(err){
            res.status(400).send(false);
        }
    });
})

//job apply request
app.post('/apply',(req,res) => {
    // res.sendStatus(200)
    jwt.verify(req.body.token, secret, (err, decoded) => {
        if(decoded){
            db.query(`INSERT INTO APPLIED VALUES (${decoded.phoneNumber}, ${req.body.id})`, (error, results) => {
                if(error)
                    res.sendStatus(400)
                else 
                    res.sendStatus(200)
            })
        }
        else {
            res.sendStatus(400)
        }
    })
})

//Listening to port
app.listen(port, () => console.log(`App listening on port ${port}!`));