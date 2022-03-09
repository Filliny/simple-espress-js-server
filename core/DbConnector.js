const CONFIG = require('../config');
const MongoClient = require('mongodb').MongoClient;

class DBConnector {
    static execute(callback) {
        const connectionString = `mongodb://${CONFIG.DB.LOGIN}:${CONFIG.DB.PASSWORD}@${CONFIG.DB.HOST}:${CONFIG.DB.PORT}`;
        MongoClient.connect(connectionString, {useUnifiedTopology:true, useNewUrlParser: true}, function(err, connector) {
            if(err) throw err;
            if(typeof callback === 'function') {
                callback(connector);
            }
        })
    }
}

module.exports = DBConnector;