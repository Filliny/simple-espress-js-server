const colors= require('colors');
const express = require('express');
const path = require('path');
var logger = require('morgan');


var cookieParser = require('cookie-parser');
var session = require('express-session');

const accountRouter = require('./routes/accountrouter');
let headerData = require('./models/header');
var authUser = null;



var app = express();

app.use(cookieParser());
app.use(session({
    secret:'SEKRET VIKA',
    resave: false,
    saveUninitialized: true
}))

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs' );
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname,'static')));
app.use(express.urlencoded({extended:false}));
app.use('/account',accountRouter);

app.get('/',function (request,responce){

    if(request.session.user){
        console.log(colors.blue("Admin is online"));
         authUser = request.session.user;
    }else{
        authUser = null;
    }

    responce.render('index.ejs',{

        header_data: new headerData(),
        title: 'Photomedia | Main Page',
        activeItem: 'Home',
        currentPage:'partials/pages/index.ejs',
        message:null,
        error: null,
        authUser:authUser
    });

});

app.get('/index.html',function (request,responce){
    responce.render('index.ejs',{
        header_data: new headerData(),
        title: 'Photomedia | Main Page',
        activeItem: 'Home',
        currentPage:'partials/pages/index.ejs',
        error: null,
        message:null,
        authUser:authUser
    });

});

app.get('/category.html',function (request,responce){
    responce.render('index.ejs',{
        header_data: new headerData(),
        title: 'Photomedia | Category Page',
        activeItem: 'Category',
        currentPage:'partials/pages/category.ejs',
        error: null,
        message:null,
        authUser:authUser
    });

});

app.get('/about.html',function (request,responce){
    responce.render('index.ejs',{
        header_data: new headerData(),
        title: 'Photomedia | About Page',
        activeItem: 'About',
        currentPage:'partials/pages/about.ejs',
        error: null,
        message:null,
        authUser:authUser
    });

});

app.get('/elements.html',function (request,responce){
    responce.render('index.ejs',{
        header_data: new headerData(),
        title: 'Photomedia | Elements Page',
        activeItem: 'Pages ',
        currentPage:'partials/pages/elements.ejs',
        error: null,
        message:null,
        authUser:authUser
    });

});

app.get('/single-blog.html',function (request,responce){
    responce.render('index.ejs',{
        header_data: new headerData(),
        title: 'Photomedia | Blog Page',
        activeItem: 'Pages ',
        currentPage:'partials/pages/singleblog.ejs',
        error: null,
        message:null,
        authUser:authUser
    });

});

app.get('/contact.html',function (request,responce){
    responce.render('index.ejs',{
        header_data: new headerData(),
        title: 'Photomedia | Contact Page',
        activeItem: 'Contact',
        currentPage:'partials/pages/contact.ejs',
        error: null,
        message:null,
        authUser:authUser
    });

});

app.get('/login.html',function (request,responce){
    responce.render('index.ejs',{
        header_data: new headerData(),
        title: 'Photomedia | Contact Page',
        activeItem: 'Contact',
        currentPage:'partials/pages/login.ejs',
        error: null,
        message:null,
        authUser:authUser
    });

});



//must be the last
app.get('/*',function (request,responce){
    responce.render('index.ejs',{
        baseUrl:'index.html',
        header_data: new headerData(),
        title: 'Page not found | Error Page',
        activeItem: '',
        currentPage:'partials/pages/404.ejs',
        error: null,
        message:null,
        authUser:authUser
    });
});

module.exports = app;