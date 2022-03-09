class Mail{

    email ;
    password ;
    smtp;
    port;
    secure;
    scope;// for selecting working account from db for testing or production

    constructor(email = '',password='',smtp = '',port = 465,secure = true,scope='') {

        this.email = email;
        this.password = password;
        this.smtp = smtp;
        this.port = port;
        this.secure = secure;
        this.scope = scope;

        let _table = "mail"

        this.getTable = function (){
            return _table;
        }
    }
}

module.exports = Mail;