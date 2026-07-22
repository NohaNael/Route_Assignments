import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
const __dirname = path.resolve()

export const attachRouterwithLogger = (app,routerPath,router,logFileName) => {
    const logDir = path.resolve(__dirname, "./src/loggers")
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })
    const logstream = fs.createWriteStream(path.resolve(logDir, logFileName),
    { flags: 'a' })


    app.use(routerPath, morgan('combined', { stream: logstream }), router)
    app.use(routerPath, morgan('dev'), router)


}
