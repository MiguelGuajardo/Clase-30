const express = require("express")
const {engine: exphbs} = require("express-handlebars")
const session = require("express-session")
const {config} = require("./src/config/index")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const auth  = require("./src/routes/authRouter")
const MongoStore = require("connect-mongo")
const { fork } = require("child_process")

const app = express()


require("./src/database")
require("./src/passport/local-auth")

/* Config hbs */
app.engine("hbs", exphbs({extname: ".hbs", defaultLayout: "main.hbs"}))
app.set("view engine", ".hbs")

/* middlewares */
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const sessionConfig ={
    store: MongoStore.create({
        mongoUrl: config.DATABASE.mongo.mongoUrl,
        dbName: config.DATABASE.mongo.mongoDbName,
        mongoOptions,
        ttl: 60,
        collectionName: config.DATABASE.mongo.mongoCollectionName
    }),
    secret: config.DATABASE.mongo.mongoSecret,
    resave: false,
    saveUninitialized: false,
    rolling:true,
    cookie: {
        maxAge:60000
    }
}
app.use(session(sessionConfig))

app.use(session({
    secret: config.DATABASE.mongo.mongoSecret,
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser("secrett"))

app.use(express.static('./public'))


/* Routes */
app.use("/", auth)

app.get("/randoms",(req,res)=>{
    const cant = req.query.cant || 10000
    const subProcess = fork("randomNumbers.js")
    const PORT = parseInt(process.argv[2]) || 8080
    const PROCESSID = process.pid
    subProcess.send(cant)
    console.log(`port: ${PORT} -> Fyh: ${Date.now()}`)
    subProcess.on("message",(cant)=>{
        res.render("randoms", { data: cant , PORT, PROCESSID})
})
})

/* Server Listen */


const server = app.listen(config.SERVER.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${config.SERVER.PORT}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));

/* Clusters*/
const parseArgs = require("minimist")
const cluster = require("cluster")
const INFO = require("./src/utils/info")
const args = parseArgs(process.argv.slice(2))
const CLUSTER = args.CLUSTER

if (CLUSTER) {
    if (cluster.isPrimary) {
        
        console.log(`CLUSTER corriendo en nodo primario ${process.pid} - Puerto ${config.SERVER.PORT}`);

        for (let i = 0; i < 4; i++) {
            cluster.fork()
        }
        cluster.on(`exit`, worker => {
            console.log(`Worker ${worker.process.pid} finalizado.`);
            cluster.fork();
        });
    } else {
        console.log(`Nodo Worker corriendo en el proceso ${process.pid}`);
    }
} else {
    console.log(`No es un cluster`);
}

