const mongoose = require('mongoose');


const TodoSchema = new mongoose.Schema({
   
    UserId:{type:String,unique:false},
    Title:{
        type:String,

    },
    Description:{
        type:String,
    },

    CreatedAt:{
        type:String,

    }
})


const Todos = mongoose.model('Todos',TodoSchema)


module.exports = {Todos}