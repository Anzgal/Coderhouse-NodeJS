import winston, { format } from "winston";
import { __dirname } from "../../utilities.js";
import { dictionary } from "../dictionary/stringDictionary.js";
import dotenv from "dotenv";

dotenv.config();

const ENV = process.env.NODE_ENV;
const transports =
    ENV === dictionary.devEnvironment
        ? [new winston.transports.Console({ level: "debug" })]
        :
        [
            new winston.transports.Console({ level: "info" }),
            new winston.transports.File({
                filename: __dirname + "/utils/log/errors.log",
                level: "info",
            }),
        ];

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "magenta",
        info: "blue",
        http: "green",
        debug: "grey",
    },
};


export const logger = winston.createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.colorize({ colors: customLevels.colors }),
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
    ),
    transports: transports,
});