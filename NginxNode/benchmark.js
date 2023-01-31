const autocannon = require("autocannon")
const {PassThrough} = require("stream")
const Logger = require("./src/utils/logger")
const logger = new Logger()

function run(url){
    const buf = []
    const outputStream = new PassThrough()

    const inst = autocannon({
        url,
        connections: 100,
        duration:20
    })

    autocannon.track(inst, {outputStream})

    outputStream.on('data', data => buf.push(data))
    inst.on('done', ()=>{
        process.stdout.write(Buffer.concat(buf))
    })
}
logger.info('Running all benchmarks in parallel...')

run('http://localhost:8080/info')