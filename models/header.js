

class Header{

    constructor() {

        let _menu = [];
        let _siteName = "Photomedia";

        this.getMenu = function(){
            return _menu;
        }

        this.menuAdd = function (headerLink){

            if(typeof headerLink === 'object'){
                _menu.push(headerLink);
            }
        }

        this.getName = function (){
            return _siteName;
        }

        let home = new HeaderLink('Home','/index.html');
        let category = new HeaderLink('Category','/category.html');
        let about = new HeaderLink('About','/about.html');
        let pages = new HeaderLink('Pages ','#');
        let sub_elements =  new HeaderLink('Elements','/elements.html');
        let sub_blog = new HeaderLink('Single-Blog','/single-blog.html');
        pages.addSubmenu(sub_elements);
        pages.addSubmenu(sub_blog);

        let contact = new HeaderLink('Contact','/contact.html');

        this.menuAdd(home);
        this.menuAdd(category);
        this.menuAdd(about);
        this.menuAdd(pages);
        this.menuAdd(contact);

    }


}

class HeaderLink{

    constructor(name, link) {
        let _name = name;
        let _link = link;
        let _submenu = null;

        this.getName = function (){
            return _name;
        }

        this.getLink = function (){
            return _link;
        }

        this.getSubmenu = function (){
            return _submenu;
        }

        this.addSubmenu = function (item){

            if(_submenu === null){
                _submenu = [];
            }

            if( typeof item === typeof this)
                    _submenu.push(item);

        }

    }

}

module.exports = Header;