

class User{

    email ;
    password ;
    firstname;
    lastname;

    constructor(email = '',password='',firstname='',lastname = '') {

        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;

         let _table = "users"
         this.getTable = function (){
             return _table;
         }

    }
}

module.exports = User;