const mongoose=require('mongoose')
const schema=mongoose.Schema
const otpschema = mongoose.Schema({
    SendBy:{
        type:String,
        require:true
    },
    SendedPhoneNo:{
        type:String,
        require:true
    },
    OTP:{
        type:String,
        require:true
    },
    CreatedDateTime:{
        type:Date,
        default:Date.now()
    },
    ReceivedBy:{
        type:String,
        require:true
    },
    CreatedBy:{
        type:String,
        default:"client"
    }
})


const otp=mongoose.model("tblotp", otpschema)

module.exports=otp