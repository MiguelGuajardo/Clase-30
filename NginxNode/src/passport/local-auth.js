const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const User = require("../models/User")


passport.serializeUser((user,done)=>{
    done(null, user.id);
})
passport.deserializeUser(async(id,done)=>{
    const user = await User.findById(id)
    done(null, user)
})


passport.use("local-register", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback:true,
}, async (req,email,password,done)=>{
    const {alias,edad,direccion,phone,firstName,lastName} = req.body
        const newUser = new User()
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.alias = alias;
        newUser.edad = edad;
        newUser.direccion = direccion;
        newUser.phone = phone;
        newUser.creationDate = new Date().toLocaleString();
        newUser.password = newUser.encryptPassword(password);
        await newUser.save()
        done(null, newUser)
    }
))
passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback:true
}, async(req,email,password,done)=>{
    const user = await User.findOne({email:email})
    if(!user){
        return done(null,false,console.log({Message:"No User Found"}) )
    }
    if(!user.comparePassword(password)){
        return done(null,false,console.log({Message:"Incorrect password"}))
    }
    done(null, user)
}))