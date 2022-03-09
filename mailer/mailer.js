'use strict'

const CONFIG = require('../config');
const context = require('../core/DbContext');
const mailEntity = require('../entities/Mail');
const colors = require('colors');
const nodemailer = require("nodemailer");

const ejs = require('ejs');
const path = require("path");

class Mailer{

    constructor() {

        let settings = new mailEntity() ;

        this.setSettings = function (settings){

            context.getMail().save(settings, function (err,result){
                if(err) throw err;
                if(result) console.log(colors.bold(colors.green('Email settings saved')))
            });

        }

        context.getMail().getOne({scope:CONFIG.MAIL.SCOPE},async function (result){
            if(result == null) {
                console.log(colors.bgYellow(colors.bold(colors.red('No prod scope account or no any account at all in database - will create and use now "dev" ethereal test account'))));
                let testAccount = await nodemailer.createTestAccount();
                result = new mailEntity(testAccount.user,testAccount.pass,'smtp.ethereal.email',587,false,'dev');
               this.setSettings(result); //create test settings record
            }
              settings  = result;
        });



        this.sendMail = async function (subject, userData, fileToRender){

            let templateFile =  path.join(__dirname,'\\templates\\'+fileToRender)
            await ejs.renderFile(templateFile, {data:userData},{},async function (err,html){

                if(err){
                    html = ejs.render('<h1>Error: <%= err.toString() %></h1>',{err:err});
                }



                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: settings.smtp,
                    port: settings.port,
                    secure: settings.secure, // true for 465, false for other ports
                    auth: {
                        user: settings.email, // generated ethereal user
                        pass: settings.password, // generated ethereal password
                    },
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: settings.email, // sender address
                    to: userData.email, // list of receivers
                    subject: subject, // Subject line
                    html: html, // html body
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>


                if(CONFIG.MAIL.SCOPE === 'dev')
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        }

    }

}

let mailer = new Mailer();
mailer = Object.freeze(mailer);

module.exports = mailer;