// npm install mongodb@2.2.5 --save
// const MongoClient = require('mongodb').MongoClient;
const{MongoClient, ObjectID} = require('mongodb');
// var id = new ObjectID();
// console.log(id);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5ae26b4a8bb921d2b72536aa")
    }, {
        $set: {
            text: 'Tsu'
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    // db.close();
});