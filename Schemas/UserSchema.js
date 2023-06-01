const mongoose = require('mongoose')


const UserSchema =  new mongoose.Schema({

    name : {
        type :  String,
        required : true,
        
    },
    mobile : {
        type : String,
        require :true,
        unique : true
    },
    email : {
        type :  String,
        required : true,
        unique : true
    },
    password :  {
        type  : String,
        required : true
    },
    token : {
        type: String,
        default  :""
    }


})


const User = mongoose.model("User" , UserSchema)

module.exports =  User;