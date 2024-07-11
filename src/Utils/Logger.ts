import chalk from 'chalk'
import Fs from 'fs'
import log, { LogLevelDesc, LogLevelNames, LogLevelNumbers } from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

const originalFactory = log.methodFactory
log.methodFactory = function (methodName: LogLevelNames, logLevel: LogLevelNumbers, loggerName: string) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName)

    return function (message) {
        rawMethod(message)
        Fs.appendFileSync(
            process.env.LOG_FILE,
            message.replaceAll(new RegExp('\\[\\d{2}m', 'g'), '') + '\n'
        )
    }
}
log.setLevel(process.env.LOG_LEVEL as LogLevelDesc)
prefix.reg(log)
prefix.apply(log, {
    format(level: LogLevelNames, name: string | undefined, timestamp: Date): string {
        let logPrefix: string = `[${(new Date()).toLocaleDateString()} ${timestamp}] ${level}:`
        switch (level.toUpperCase()) {
            case 'TRACE':
                logPrefix = chalk.cyan(logPrefix)
                break
            case 'DEBUG':
                logPrefix = chalk.blue(logPrefix)
                break
            case 'INFO':
                logPrefix = chalk.green(logPrefix)
                break
            case 'WARN':
                logPrefix = chalk.yellow(logPrefix)
                break
            case 'ERROR':
                logPrefix = chalk.red(logPrefix)
                break
        }

        return logPrefix
    }
})

export default log
