const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id: '5ae4dde4c7d0cff4f948c04a'}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('5ae4dde4c7d0cff4f948c04a').then((todo) => {
    console.log(todo);
});