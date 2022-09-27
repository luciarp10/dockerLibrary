const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const utils = require('./utils');
const fs = require('fs');
const { env } = require('process');
const os  = require('os');
const mysql = require('mysql');

const version = "3.0";
const hostbd = env.HOST_BD; 
const portbd = env.PORT_BD;
const userbd = env.USER_BD; 
const passwdbd = env.PASS_BD;
const dbname = env.NAME_BD; 

var connection = mysql.createConnection({
    host     : hostbd,
    port     : portbd, //3306
    user     : userbd, //root
    password : passwdbd, //root
    database : dbname //books
});

// fn to create express server
const create = async () => {

    // server
    const app = express();
    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    app.use(express.json())

    // Log request
    app.use(utils.appLogger);

    // root route - serve static file
    app.get('/', (req, res) => {
        res.json({nodeName: os.hostname()
            , version: version});
        res.end();  
    });

    app.post("/books", (req,res) => {
        var ms = Date.now();
        var datems = new Date(ms);
        var day = datems.getDate();
        var month = datems.getMonth()+1;
        var year = datems.getFullYear();
        
        var date = year+"-"+month+"-"+day

        query = 'INSERT INTO books VALUES (\''+req.body.title+'\', \''+req.body.content+'\', \''+date+'\')';
        console.log(query)

        connection.query(query, function(err, rows, fields) {
            if(err){
                console.log("Error al hacer la consulta. "+ err.stack);
                return;
            }

            console.log("Inserción ejecutada con éxito:");
            res.json({
                title: req.body.title,
                content: req.body.content,
                date: date
            })
        });
    })

    app.get("/books", (req, res) => {
        utils.createDirIfNotExist(booksDir, fs);

        query = 'SELECT * from books';

        connection.query(query, function(err, rows, fields) {
            if(err){
                console.log("Error al hacer la consulta. "+ err.stack);
                return;
            }
            res.json(rows);
            console.log("Consulta ejecutada con éxito:", rows);
        });
    })

    // Catch errors
    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};


module.exports = {
    create
};