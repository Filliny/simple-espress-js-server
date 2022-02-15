const SERV_CONFIG= require('./config');
const colors= require('colors');
const http=require('http');
const serverExpressApp= require('./server');
const SERVER= http.createServer(serverExpressApp);

SERVER.listen(SERV_CONFIG.SERVER.PORT);

SERVER.on( 'listening', function(){
    console.log("Server started : " + "http://"+SERV_CONFIG.SERVER.HOST+":"+SERV_CONFIG.SERVER.PORT);
});

SERVER.on( 'request', function(request) {
    //console. log(request);
    console.log("REQUEST:"+ colors.green(request.url));
});