import { format, transports, createLogger } from "winston";
import * as dotenv from "dotenv";
dotenv.config();

export const logger = createLogger({
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.prettyPrint()
  )
});

if (process.env.SERVER === "dev") {
  logger.add(new transports.Console({
    level: "info"
  }));
} else if (process.env.SERVER === "prod") {
  logger.add(new transports.File({
    filename: "logs/errors.log",
    level: "error",
    maxsize: 5242880,
    maxFiles: 5
  }));
}
