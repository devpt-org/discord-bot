export default interface LoggerService {
  log(...args: unknown[]): void;
  error(...args: unknown[]): void;
  warning(...args: unknown[]): void;
  info(...args: unknown[]): void;
}
