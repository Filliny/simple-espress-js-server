const CONFIG = require('../config');
const { Collection } = require('mongodb');
const DBConnector = require('./DBConnector');

class BasicEntity{

    constructor(basicEntity) {
        let _collectionName;
        let _entity;

        this.getCollectionName = function() {
            return _collectionName;
        }

        let setCollectionName = function (name){
            _collectionName = name;
        }

        let setEntity = function (entity){
            _entity = entity;
        }

        this.getEntity = function (){
            return _entity;
        }

        setEntity(basicEntity);

        setCollectionName(basicEntity.getTable());

    }


    getOne(searchPattern = {}, callback) {
        DBConnector.execute(function(conn) {
            var _base = conn.db(CONFIG.DB.NAME);
            var collection =  _base.collection(this.getCollectionName());
            collection.findOne(searchPattern, function(err, result) {
                if(err) throw err;
                if(typeof callback === 'function'){
                    conn.close();
                    callback(result);
                }
            });
        }.bind(this));
    }

    save(item,callback){

        if(item.constructor === this.getEntity().constructor){

            DBConnector.execute(function(conn) {
                var _base = conn.db(CONFIG.DB.NAME);
                var collection =  _base.collection(this.getCollectionName());
                collection.insertOne(item, function(err, result) {
                    if(err) throw err;
                    if(result){
                        conn.close();
                        callback(err,result);
                    }
                });
            }.bind(this));
        }else{
            callback(new Error("Entity type to save is not equals with the collection basic type"),null);
        }

    }

    find(filter = null,callback){
        if(filter === null) return;

        DBConnector.execute(function(conn) {
            var _base = conn.db(CONFIG.DB.NAME);
            var collection =  _base.collection(this.getCollectionName());
            collection.findOne(filter, function(err, result) {
                if(err) throw err;
                if(typeof callback === 'function'){
                    conn.close();
                    callback(err,result);
                }
            });
        }.bind(this));

    }

    updateItem(filter = null,updates,callback){
        if(filter === null) return;

        DBConnector.execute(function(conn) {
            var _base = conn.db(CONFIG.DB.NAME);
            var collection =  _base.collection(this.getCollectionName());
            collection.updateOne(filter,updates,{}, function(err, result) {
                if(err) throw err;
                if(typeof callback === 'function'){
                    conn.close();
                    callback(err,result);
                }
            });
        }.bind(this));

    }

    delete(filter = null,callback){
        if(filter === null) return;

        DBConnector.execute(function(conn) {
            var _base = conn.db(CONFIG.DB.NAME);
            var collection =  _base.collection(this.getCollectionName());
            collection.deleteOne(filter, function(err, result) {
                if(err) throw err;
                if(typeof callback === 'function'){
                    conn.close();
                    callback(err,result);
                }
            });
        }.bind(this));

    }

    deleteAll(filter = null,callback){
        if(filter === null) return;

        DBConnector.execute(function(conn) {
            var _base = conn.db(CONFIG.DB.NAME);
            var collection =  _base.collection(this.getCollectionName());
            collection.deleteMany(filter, function(err, result) {
                if(err) throw err;
                if(typeof callback === 'function'){
                    conn.close();
                    callback(err,result);
                }
            });
        }.bind(this));

    }
}


module.exports = BasicEntity;