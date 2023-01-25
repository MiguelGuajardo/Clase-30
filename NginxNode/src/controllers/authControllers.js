const passport = require("passport")
const Product = require("../models/Product")
const sharp = require("sharp")
const fs = require("fs")
const INFO = require("../utils/info")
const { fork } = require("child_process")

const login = (req,res,next)=>{
    res.render("login")
}
const loginPassport = passport.authenticate("local-login" ,{
    successRedirect:"/",
    failureRedirect:"/login",
    passReqToCallback:true
})
const register = (req,res,next)=>{
    res.render("register")
}
const registerPassport = passport.authenticate("local-register",{
    successRedirect:"/",
    failureRedirect:"/register",
    passReqToCallback:true
})
const logOut = (req, res, next) => {
    res.redirect('/login');
    req.session.destroy()
  }
const authenticateHome = async(req,res,next)=>{
    let datos = req.user
    let datosProducts = await Product.find({}).lean()
    const {alias} = datos

    res.render("index",{alias,datosProducts})
}
const productPost = async(req,res,next)=>{
    const {title,price,thumbnail} =req.body
    const newProduct = new Product()
    newProduct.title = title
    newProduct.price = price
    newProduct.thumbnail = thumbnail
    await newProduct.save()
    res.redirect("/")
}
const profile = (req,res)=>{
    let datos = req.user
    const {email,firstName,lastName,alias,edad,direccion,creationDate,phone,_id} = datos
    const avatarImageId = `uploads/${_id}.png`
    const sesionId = req.session.id
    res.render("profile",{sesionId, email,alias,edad,direccion,creationDate,phone,firstName,lastName,avatarImageId,_id})
}
const profileThumbnail = async (req,res,next)=>{
    let datos = req.user
    const {email,firstName,lastName,alias,edad,direccion,creationDate,phone,_id} = datos

    const avatar = req.file

    const proccesedAvatar = sharp(avatar.buffer)
    const resizeAvatar = proccesedAvatar
    const resizeAvatarBuffer = await resizeAvatar.toBuffer()
    fs.writeFileSync(`public/uploads/${_id}.png`,resizeAvatarBuffer)
    const avatarImageId = `uploads/${_id}.png`

    res.render("profile",{email,firstName,lastName,alias,edad,direccion,creationDate,phone,avatarImageId})
    
}
const info = (req,res)=>{
    const data = INFO
    res.render("info", {data})
}
const randomNumbers = (req,res)=>{
    const cant = req.query.cant || 10000
    const subProcess = fork("randomNumbers.js")
    const PORT = parseInt(process.argv[2]) || 8080
    const PROCESSID = process.pid
    subProcess.send(cant)
    subProcess.on("message",(cant)=>{
        res.render("randoms", { data: cant , PORT, PROCESSID})
    })
}

module.exports = {
    login,
    loginPassport,
    register,
    registerPassport,
    logOut,
    authenticateHome,
    productPost,
    profile,
    profileThumbnail,
    info,
    randomNumbers
}