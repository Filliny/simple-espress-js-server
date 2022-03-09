// /account/loginin
// /account/register

'use strict'

const CONFIG = require('../config');
const express = require('express');
const colors = require('colors');
const mailer = require('../mailer/mailer');
let headerData = require('../models/header');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var shajs = require('sha.js')

var context = require('../core/DbContext');
var User = require('../entities/User');
var Recovery = require('../entities/Recovery')
const accountRouter = express.Router();



accountRouter.use(function (request,response,next){

    console.log(colors.america("Middleware: ")+ colors.yellow((request.baseUrl)));

    next();
})

accountRouter.get('/login.html',function (request,response){


    response.render('index.ejs', {
        header_data: new headerData(),
        title: 'Photomedia | Login Page',
        activeItem: '',
        currentPage:'partials/pages/login.ejs',
        error: null,
        message:null,
        authUser:null
    });
})

accountRouter.get('/register.html',function (request,response){
    response.render('index.ejs', {
        header_data: new headerData(),
        title: 'Photomedia | Register Page',
        activeItem: '',
        currentPage:'partials/pages/signin.ejs',
        error: null,
        message:null,
        authUser:null
   });
})

accountRouter.get('/recovery.html', function (request,response){
    response.render('index.ejs', {
        header_data: new headerData(),
        title: 'Photomedia | Password recovery',
        activeItem: '',
        currentPage:'partials/pages/recovery.ejs',
        error: null,
        message:null,
        authUser:null
    });
})

accountRouter.get('/logout.html',function (request,response){
    delete request.session.login;
    request.session.destroy();
    response.redirect('/');
})

accountRouter.get('/setnewpassword',function (request,response){

    let token= request.query.token;

    context.getRecovery().getOne({token:token},function (result){
        if(result != null){

            response.render('index.ejs', {
                header_data: new headerData(),
                title: 'Photomedia | Set Password',
                activeItem: '',
                currentPage:'partials/pages/new_password.ejs',
                error: null,
                message:null,
                authUser:null,
                token: token
            });


        }else{

            response.render('index.ejs', {
                header_data: new headerData(),
                title: 'Photomedia | Set Password',
                activeItem: '',
                currentPage: 'partials/pages/recovery.ejs',
                error: "Password recovery request expired or not exist - try recover password again!",
                message: null,
                authUser: null
            });

        }
    })

})

accountRouter.get('/*',function (request,response){
    response.redirect('/404');
})


accountRouter.post('/recovery',function (request,response){
    var user_email = request.body.email;                //полное соответсвие аттрибуту name тега input

    console.log("email "+ user_email+ " to recovery " );

    context.getUsers().find({
        email:user_email
    },function (err,user){
        if(err)throw err;


        let random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
        let tokenValue =  shajs('sha256').update(user_email+random).digest('hex');


        if(user != null) {//user exist

            let recoveryQueue = new Recovery(user_email,tokenValue);

            context.getRecovery().save(recoveryQueue, function (err,result){
                if(err) throw err;


                mailer.sendMail(
                    'Password recovery',
                    {
                        link: "http://"+CONFIG.SERVER.HOST+":"+CONFIG.SERVER.PORT+'/account/setnewpassword?token='+tokenValue,
                        email: user_email
                    },
                    'recovery.ejs');

                response.render('index.ejs', {
                    header_data: new headerData(),
                    message: "Recovery link is sent to your email "+user_email+ " -  check for new mails, than follow link in a message! ",
                    error: null ,
                    title: 'Photomedia | Recovery',
                    activeItem: '',
                    currentPage: 'partials/pages/recovery.ejs',
                    authUser:null
                });


            } );



        } else {
            response.render('index.ejs', {
                header_data: new headerData(),
                message: null,
                error: "User with email "+user_email+" not registered!" ,
                title: 'Photomedia | Recovery',
                activeItem: '',
                currentPage: 'partials/pages/recovery.ejs',
                authUser:null
            });
        }
    })

})



accountRouter.post('/checkUser',urlencodedParser,  function(request, response){
    var user_email = request.body.email;                //полное соответсвие аттрибуту name тега input
    var user_password = request.body.password;          //полное соответсвие аттрибуту name тега input

    console.log("email "+ user_email+ " password " + user_password);

    user_password = shajs('sha256').update(user_password).digest('hex');
    context.getUsers().find({
        email:user_email,
        password:user_password
    },function (err,user){
        if(err)throw err;

        console.dir(user);

        if(user != null) {//прошел аутентификацию

            request.session.user = {};
            request.session.user.login = user.firstname;
            request.session.user.email = user.email;
            request.session.save();

            response.redirect('/');
        } else {
            response.render('index.ejs', {
                header_data: new headerData(),
                message: null,
                error: "Login error",
                title: 'Photomedia | Login',
                activeItem: '',
                currentPage: 'partials/pages/login.ejs',
                authUser:null
            });
        }
    })

});

accountRouter.post('/register',urlencodedParser,  function(request, response){

    var user_email = request.body.email;
    var user_password = request.body.password;
    var user_firstname = request.body.firstname;
    var user_lastname = request.body.lastname;

    user_password = shajs('sha256').update(user_password).digest('hex');

    var newUser = new User(
        user_email,
        user_password,
        user_firstname,
        user_lastname
    )

    context.getUsers().find({ email:newUser.email.toString() }, function (err,result){ //check if user exists
         if(err)throw err;

         if(result){ //if exists

             response.render('index.ejs', {
                 header_data: new headerData(),
                 message: null,
                 error: "Registration error : user "+user_email+" already registered!",
                 title: 'Photomedia | Registration',
                 activeItem: '',
                 currentPage: 'partials/pages/signin.ejs',
                 authUser:null
             });

         }else{ //Try to save user

             context.getUsers().save( newUser, function (err,result){

                 console.dir(colors.white(colors.bgBlue(result)));

                 if(result != null) {//successfully saved

                     request.session.user = {};
                     request.session.user.login = newUser.firstname;
                     request.session.user.email = newUser.email;
                     request.session.save();

                     mailer.sendMail('New registration',newUser,'registration.ejs')

                     response.redirect('/');

                 } else {

                     response.render('index.ejs', {
                         header_data: new headerData(),
                         message: null,
                         error: "Registration error : "+ err.toString(),
                         title: 'Photomedia | Registration',
                         activeItem: '',
                         currentPage: 'partials/pages/signin.ejs',
                         authUser:null
                     });
                 }
             })
         }

    })

});

accountRouter.post('/set_password', function (request,response){

    let token= request.query.token;
    var user_password = request.body.password;
    var user_confirm_password = request.body.confirm_password;

    if(user_password === user_confirm_password){

        context.getRecovery().getOne({token:token},function (result) {

            if (result != null) {

                user_password = shajs('sha256').update(user_password).digest('hex');
                let email = result.email;

                context.getUsers().updateItem( //update user
                    {email:email},
                    {$set:{password:user_password}},
                    function (err,result){
                        if(err) throw  err;

                        context.getRecovery().deleteAll({email:email},function (err,result){ //delete all tokens by email cos password changed once
                            if(err)throw err;

                            response.render('index.ejs', {
                                header_data: new headerData(),
                                title: 'Photomedia | Login',
                                activeItem: '',
                                currentPage: 'partials/pages/login.ejs',
                                error: null,
                                message: 'Password successfully set! Please login with your new password!',
                                authUser: null,
                            });

                        })

                    });


            }else{
                response.render('index.ejs', {
                    header_data: new headerData(),
                    title: 'Photomedia | Set Password',
                    activeItem: '',
                    currentPage: 'partials/pages/recovery.ejs',
                    error: "Password recovery request expired or not exist - try recover password again!",
                    message: null,
                    authUser: null
                });
            }
        })
    }else{

        response.render('index.ejs', {
            header_data: new headerData(),
            title: 'Photomedia | Set Password',
            activeItem: '',
            currentPage:'partials/pages/new_password.ejs',
            error: "Passwords do not match!",
            message:null,
            authUser:null,
            token: token
        });

        // let url = "http://"+CONFIG.SERVER.HOST+":"+CONFIG.SERVER.PORT+'/account/setnewpassword?token='+token;
        // response.redirect(url);
    }



});

accountRouter.post("/")


module.exports = accountRouter;