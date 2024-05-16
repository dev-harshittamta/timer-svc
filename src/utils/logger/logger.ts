import { AsyncLocalStorage } from "node:async_hooks";
import winston, {transports, format, Logger} from "winston";


export const asyncLocalStorage: AsyncLocalStorage<Map<string, string>> = new
AsyncLocalStorage<Map<string, string>>();


export const log : Logger = winston.createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.errors({ stack: true}),
                format.label({ label: '[TIMER-SERVICE]'}),
                format.timestamp({ format: 'DD-MM-YY HH:MM:SS' }),
                format.printf(({ label, level, message, timestamp, stack }):string => {
                    try{
                        const logData: Map<string, string> | undefined = asyncLocalStorage.getStore();
                        let logDataString: string = "";
                        if (logData) {
                            // convert to string key value pair
                            logDataString = Array.from(logData!.keys()).reduce((acc, key) => {
                                return `${key}: ${logData!.get(key)}`;
                            }, "");
                        }
                        if (stack) {
                            // print log with trace
                            return `${label} ${timestamp}  ${level}: ${logDataString} | ${message} - ${stack}`;
                        }
                        return `${label} ${timestamp} ${level}: ${logDataString ? logDataString + ' |': '' } ${message}`;
                    }catch (err){
                        return `${label} ${timestamp} ${level}: ${message}`
                    }
                }),
            )
        })
    ]
});
