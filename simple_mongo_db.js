const colors = require('colors');
const {use} = require("express/lib/router");
const MongoClient = require('mongodb').MongoClient;

const connectionString = "mongodb://root:example@localhost:27017"

MongoClient.connect(connectionString,{useNewUrlParser: true, useUnifiedTopology:true},function (err,connector){
    if(err)throw err;

    var testDb = connector.db('testDb');

    // testDb.createCollection('products', function (err,result){
    //
    //     if(err)throw err;
    //
    //     console.log(result);
    //     connector.close();
    // });

    // testDb.listCollections().toArray(function (error, result){
    //         if(err)throw err;
    //
    //         console.log(result);
    //         connector.close();
    // })

    // testDb.collection('products').rename('orders',function (error, result){
    //     if(err)throw err;
    //
    //     console.log(result);
    //     connector.close();
    // })

    // var userCollection = testDb.createCollection('users', function (err,result){
    //     if(err) throw err;
    //
    //     var newUser = {
    //         login: 'Petya',
    //         email: 'petya@gmail.com',
    //         password: 'qwerty',
    //         active: true
    //     }
    //
    //     userCollection = testDb.collection('users');
    //
    //     userCollection.insertOne(newUser, function (err,result){
    //        if (err)throw err;
    //
    //        if(result) console.log(colors.green("Vasya was created"));
    //        connector.close();
    //     });
    //
    // })


    var newUser = {
        login: 'Petya',
        email: 'petya@gmail.com',
        password: 'qwerty',
        active: true
    }

    var userCollection = testDb.collection('users');

    // userCollection.insertOne(newUser, function (err,result){
    //     if (err)throw err;
    //
    //     if(result) console.log(colors.green("Vasya was created"));
    //     connector.close();
    // });

    userCollection.find({}).toArray(function (error, result){
        if (error) throw error;

        console.log(result);
    });

    userCollection.findOne({login:'Vasya'}, function (error, result){
        if (error) throw error;

        console.log(result);
    });

    var sortPredicate = {login: 1}//1 asc ; -1 desc

    userCollection.find({}).sort(sortPredicate).toArray(function (error, result){
        if (error) throw error;

        console.dir(result);
    });

    console.log(colors.green("Connection created"));

    userCollection.updateOne()
    //connector.close();
})