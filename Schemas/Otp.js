const mongoose = require('mongoose')


const OtpSchema =  new mongoose.Schema({

   id : {
        type :  String,
        required : true,
        
    },
    otp : {
        type : String,
        require :true,
        unique : true
    }
})


const Otp = mongoose.model("Otp" , OtpSchema)

module.exports =  Otp;