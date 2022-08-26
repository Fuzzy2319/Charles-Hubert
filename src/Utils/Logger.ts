import log, {LogLevelDesc} from 'loglevel'
import prefix from 'loglevel-plugin-prefix'
import chalk from 'chalk'

log.setLevel(process.env.LOG_LEVEL as LogLevelDesc)
prefix.reg(log)
prefix.apply(log, {
    format(level: string, name: string | undefined, timestamp: Date): string {
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