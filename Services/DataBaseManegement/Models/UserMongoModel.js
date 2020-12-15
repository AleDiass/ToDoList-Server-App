const mongoose = require('mongoose');







const UsersSchema = new mongoose.Schema({
    _id:{
        type:String,
        auto:false,
    },
    Username:{
        type:String,
        required:true,
        unique:true,
    
        
    },
    Password:{
        type:String,
        required:true,
    },
    CreatedAt:{
        type:String,
        default:Date.now,
    },
    

    
    
  
})


const Users = mongoose.model('User',UsersSchema)

module.exports = {Users}

