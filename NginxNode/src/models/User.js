const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")
const {Schema, model} = mongoose

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true,
        index: {unique: true}
    },
    alias:{
        type: String,
        unique:true,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    edad:{
        type: String,
        required: true
    },
    direccion:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    creationDate:{
        type: String
    },
    password:{
        type: String,
        required: true
    }
})
userSchema.methods.encryptPassword = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

const User = model("User", userSchema)
module.exports = User 
