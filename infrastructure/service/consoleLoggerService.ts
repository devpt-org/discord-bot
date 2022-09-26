import LoggerService from "../../domain/service/loggerService";

export default class ConsoleLoggerService implements LoggerService {
  log(...args: unknown[]) {
    console.log(...args);
  }
}
