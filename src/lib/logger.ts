const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

interface LogEntry {
  level: string
  message: string
  timestamp: string
  service: string
  [key: string]: any
}

class SimpleLogger {
  private level: string

  constructor(level: string) {
    this.level = level
  }

  private log(level: string, message: string, meta: Record<string, any> = {}) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: 'talent-marketplace',
      ...meta
    }

    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry))
    } else {
      console.log(`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, meta)
    }
  }

  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta)
  }

  error(message: string, meta?: Record<string, any>) {
    this.log('error', message, meta)
  }

  debug(message: string, meta?: Record<string, any>) {
    if (this.level === 'debug') {
      this.log('debug', message, meta)
    }
  }
}

const logger = new SimpleLogger(logLevel)

export { logger }

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    })
  })
  
  next()
}

// Error logging
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    ...context,
  })
}

// Performance logging
export const logPerformance = (operation: string, duration: number, metadata?: Record<string, any>) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    ...metadata,
  })
}