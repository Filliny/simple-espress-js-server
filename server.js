const colors= require('colors');
const express = require('express');
const path = require('path');
var logger = require('morgan');

let headerData = require('./models/header');
let headerEx = new headerData();


var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs' );

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname,'static')));
app.use(express.urlencoded({extended:false}));

app.get('/',function (request,responce){
    responce.render('index.ejs',{
        message:"Hello",
        error: null,
        success:"Wellcome",
        header_data: new headerData(),
        title: 'Our site name | Main Page',
        currentPage:'partials/pages/index.ejs'
    });
});

//must be the last
app.get('/*',function (request,responce){
    responce.render('index.ejs',{
        message:null,
        error: 'Page not found - try later',
        success: null,
        header_data: new headerData(),
        title: 'Page not found | Error Page',
        currentPage:'partials/pages/404.ejs'
    });
});

module.exports = app;