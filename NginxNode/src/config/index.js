const dotenv = require("dotenv")
dotenv.config()

const config = {
    SERVER: {
        HOST:process.env.HOST,
        PORT: process.argv[2] || process.env.PORT || 8080,
    },
    DATABASE:{
        mongo: {
            mongoUrl:process.env.MONGO_URL,
            mongoDbName:process.env.MONGO_DB_NAME,
            mongoCollectionName: process.env.MONGO_COLLECTION_NAME,
            mongoSecret: process.env.CODE_SECRET
        }
    }
}

module.exports = {config}