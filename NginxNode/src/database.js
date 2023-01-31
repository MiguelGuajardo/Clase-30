const { config } = require("./config/index")
const mongoose = require("mongoose");
const Logger = require("./utils/logger")
const logger = new Logger()
mongoose.set('strictQuery', true);
mongoose.connect(config.DATABASE.mongo.mongoUrl, {useNewUrlParser: true})
.then(db => logger.info("Base de Datos mongoDB conectada"))
.catch(err => console.error(err))