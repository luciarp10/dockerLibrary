const express = require('express');
const body_parser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const utils = require('./utils');
const fs = require('fs');
const { env } = require('process');
const os  = require('os');
const { stringify } = require('querystring');
const mysql = require('mysql');

const WORKDIR = env.PWD;
const booksDir = env.PV ? env.PV + "/books/" : WORKDIR + "/books/"; // /usr/src/data
const version = "1.0";
const secret = env.NODE_USERNAME + ":" + env.NODE_PASSWORD;

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'root',
    database : 'books'
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
            , version: version, credentials: secret});
        res.end();  
    });

    app.post("/books", (req,res) => {
        var ms = Date.now();
        var datems = new Date(ms);
        var day = datems.getDate();
        var month = datems.getMonth()+1;
        var year = datems.getFullYear();
        
        var date = year+"-"+month+"-"+day
        var book_path = booksDir+req.body.title+".txt";

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
        var books = []
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
