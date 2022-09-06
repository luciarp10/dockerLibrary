const express = require('express');
const body_parser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const utils = require('./utils');
const fs = require('fs');
const { env } = require('process');
const os  = require('os');
const { stringify } = require('querystring');

const WORKDIR = env.WORKDIR;
const booksDir = WORKDIR + "/books/";

const version = env.VERSION ? env.VERSION : "1.0";

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
        
        var date = day +"/"+month+"/"+year
        var stream = fs.createWriteStream(booksDir+req.body.title+".txt");

        stream.once('open', (fd) => {
            stream.write('{\n"Title": "' + req.body.title + '",\n');
            stream.write('"Date":"' + date + '",\n');
            stream.write('"Content": "' + req.body.content +'"\n}')
            stream.end();
        });

        res.json({
            title: req.body.title,
            date: date
        })
        res.end();
    })

    app.get("/books", (req, res) => {
        var books = []
        fs.readdir(booksDir, function(err, files){
            if (err){
                res.status = 404;
            }
            
            console.log(files);
            files.forEach(function(file){
                
                books.push({fileName:file});
            })
            res.json(books)
            res.end();
        })  
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
