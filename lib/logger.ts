export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
  }
  
  interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  }
  
  export class Logger {
    private static shouldLog(level: LogLevel): boolean {
      if (process.env.NODE_ENV === 'production') {
        return level !== LogLevel.DEBUG;
      }
      return true;
    }
  
    private static createLogEntry(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
      return {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(metadata && { metadata })
      };
    }
  
    private static writeLog(entry: LogEntry) {
      const logString = JSON.stringify(entry, null, 2);
      
      switch(entry.level) {
        case LogLevel.ERROR:
          console.error(logString);
          break;
        case LogLevel.WARN:
          console.warn(logString);
          break;
        default:
          console.log(logString);
      }
    }
  
    static log(level: LogLevel, message: string, metadata?: Record<string, any>) {
      if (!this.shouldLog(level)) return;
  
      const entry = this.createLogEntry(level, message, metadata);
      this.writeLog(entry);
    }
  
    static info(message: string, metadata?: Record<string, any>) {
      this.log(LogLevel.INFO, message, metadata);
    }
  
    static warn(message: string, metadata?: Record<string, any>) {
      this.log(LogLevel.WARN, message, metadata);
    }
  
    static error(message: string, metadata?: Record<string, any>) {
      this.log(LogLevel.ERROR, message, metadata);
    }
  
    static debug(message: string, metadata?: Record<string, any>) {
      this.log(LogLevel.DEBUG, message, metadata);
    }
  }