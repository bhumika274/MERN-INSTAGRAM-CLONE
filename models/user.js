const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    pic:{
        type:String,
        default: "https://res.cloudinary.com/bhuicc/image/upload/v1707037510/irjvunkymmddarebuonz.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})
module.exports=mongoose.model("User", userSchema);

//compiles a db with this data structure.