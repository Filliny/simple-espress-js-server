class Recovery{

    email ;
    token ;

    constructor(email = '',token='') {

        this.email = email;
        this.token = token;

        let _table = "recovery"

        this.getTable = function (){
            return _table;
        }
    }
}

module.exports = Recovery;