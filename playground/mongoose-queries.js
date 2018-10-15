const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '15ae27076906ac3aa080409b9';

if(!ObjectID.isValid(id))
{
    console.log('Invalid Id');
}

// Recommended for find many documents
Todo.find({
    _id: id
}).then((todos) => {
    console.log(todos);
});

// Recommended for find one document
Todo.findOne({
    _id: id
}).then((todo) => {
    console.log(todo);
});

// Recommended for find oe document BY ID
Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('Id not found');
    }
    console.log(todo);
}).catch((err) => {
    console.log(err);
});