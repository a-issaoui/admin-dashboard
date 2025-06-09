export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message)
        this.name = 'AppError'
        Error.captureStackTrace(this, this.constructor)
    }
}

export const errorHandler = {
    handleAsync: <T extends unknown[], R>(
        fn: (...args: T) => Promise<R>
    ) => {
        return async (...args: T): Promise<R> => {
            try {
                return await fn(...args)
            } catch (error) {
                console.error('Async operation failed:', error)
                throw error instanceof AppError ? error : new AppError(
                    'An unexpected error occurred',
                    'UNKNOWN_ERROR',
                    500
                )
            }
        }
    },

    handleSync: <T extends unknown[], R>(
        fn: (...args: T) => R
    ) => {
        return (...args: T): R => {
            try {
                return fn(...args)
            } catch (error) {
                console.error('Sync operation failed:', error)
                throw error instanceof AppError ? error : new AppError(
                    'An unexpected error occurred',
                    'UNKNOWN_ERROR',
                    500
                )
            }
        }
    }
}