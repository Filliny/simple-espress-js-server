const BasicEntity = require('./BasicEntity');
const User = require('../entities/User');
const Mail = require('../entities/Mail');
const Recovery = require('../entities/Recovery');



class DbContext {

    constructor() {

        let _users = new BasicEntity(new User());
        let _mail = new BasicEntity(new Mail());
        let _recovery = new BasicEntity(new Recovery());

        this.getUsers = function (){

            return _users;
        }

        this.getMail = function (){

            return _mail;
        }

        this.getRecovery = function (){

            return _recovery;
        }
    }



}

let context = new DbContext();
context = Object.freeze(context);

module.exports = context;