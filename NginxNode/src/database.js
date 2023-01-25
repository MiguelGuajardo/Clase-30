const { config } = require("./config/index")
const mongoose = require("mongoose")
mongoose.set('strictQuery', true);
mongoose.connect(config.DATABASE.mongo.mongoUrl, {useNewUrlParser: true})
.then(db => console.log("Base de Datos mongoDB conectada"))
.catch(err => console.error(err))