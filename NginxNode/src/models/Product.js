const mongoose = require("mongoose")
const ProductSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    }
})
const Product = mongoose.model("product", ProductSchema)

module.exports = Product