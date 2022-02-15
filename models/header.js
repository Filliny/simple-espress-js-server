

class Header{

    constructor() {

        let _menu = ['Home','Products','Contacts'];
        let _siteName = "SECUREMARK";

        this.getMenu = function(){
            return _menu;
        }

        this.getName = function (){
            return _siteName;
        }
    }


}

module.exports = Header;