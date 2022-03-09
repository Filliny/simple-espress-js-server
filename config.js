'use strict';

let CONFIG = {
    SERVER: {
        HOST: '127.0.0.1',
        PORT: 8089
    },
    DB: {
        LOGIN:'root',
        PASSWORD:'example',
        HOST:'localhost',
        PORT:27017,
        NAME:'testDb'
    },
    MAIL:{
        SCOPE:'dev', //for testing use 'dev', in production set 'prod' and add configuration to database
    }
}

CONFIG = Object.freeze(CONFIG);

module.exports = CONFIG