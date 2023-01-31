/* const {config} = require("../config/index")
const winston = require("winston")

const buildProdLogger = ()=>{
    const prodLogger = winston.createLogger({
        transports:[
            new winston.transports.File({filename:"debug.log", level:"debug"}),
            new winston.transports.File({filename:"warn.log", level:"warn"}),
            new winston.transports.File({filename:"error.log", level:"error"})
        ],
    })
    return prodLogger
}
const buildDevLogger = ()=>{
    const devLogger = winston.createLogger({
        transports:[
            new winston.transports.Console({level:"info"})
        ],
    })
    return devLogger
}
let logger = null

if(config.LOGGER.WINSTON === "production"){
    logger = buildProdLogger()
}else{
    logger = buildDevLogger()
}

module.exports = logger */

const util    = require("util")
const moment  = require("moment")
const winston = require("winston")

class Logger {
    constructor() {
        this.winstonLogger = winston.createLogger({
          levels      : { error: 1, warn: 2, info: 3 },
          transports  : this._createTransports(),
          exitOnError : false,
        })
      }

  info(message, data) { this.winstonLogger.info({ message, data }) }
  warn(message, data) { this.winstonLogger.warn({ message, data }) }
  error(message, data) { this.winstonLogger.error({ message, data }) }

  _createTransports() {
    const TRANSPORTS = []
    TRANSPORTS.push(new winston.transports.Console({
      format           : winston.format.printf(this._consoleFormat()),
      level            : 'info', // Muestra logs de nivel 3 o menor
      handleExceptions : false,
      colorize         : false,
      json             : false,
    }))
    Array.from(['info', 'warn', 'error']).forEach(level => {
      TRANSPORTS.push(new winston.transports.File({
        format           : winston.format.printf(this._fileFormat()),
        level            : level,
        handleExceptions : false,
        colorize         : false,
        json             : true,
        filename         : `logs/${level}.log`,
        maxsize          : 5242880, // 5242880 Bytes = 5 MB
        maxFiles         : 5,
      }))
    })
    return TRANSPORTS
  }
  _consoleFormat () {
    const COLORS = {
      error : `\x1b[91m`, // LIGHT_RED
      warn  : `\x1b[93m`, // LIGHT_YELLOW
      info  : `\x1b[96m`, // LIGHT_CYAN
      reset : `\x1b[0m`,  // Restaura al color por defecto
    }
    return (info) => {
      const START     = COLORS[info.level]
      const END       = COLORS.reset
      const TIMESTAMP = moment().format('DD/MM/YYYY HH:mm:ss')
      const LEVEL     = info.level
      const MESSAGE   = info.message
      const DATA      = info.data ? util.inspect(info.data, false, null) : ''
      return `${START} ${TIMESTAMP} [${LEVEL}] ${MESSAGE} ${DATA} ${END}`
    }
  }
  _fileFormat() {
    return (info)  => {
      const TIMESTAMP = moment().format('DD/MM/YYYY HH:mm:ss')
      const LEVEL     = info.level
      const MESSAGE   = info.message
      const DATA      = info.data ? util.inspect(info.data, false, null) : null
      return JSON.stringify({
        timestamp : TIMESTAMP,
        level     : LEVEL,
        message   : MESSAGE,
        data      : DATA,
      })
    }
  }
}

module.exports = Logger
