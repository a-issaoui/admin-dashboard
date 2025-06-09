import { z } from 'zod'

const envSchema = z.object({
    // Public variables
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Educasoft Dashboard'),
    NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),

    // Server-only variables
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Security-related environment variables
    SESSION_SECRET: z.string().min(32).optional(),
    ENCRYPTION_KEY: z.string().min(32).optional(),

    // Database and external service URLs (if applicable)
    DATABASE_URL: z.string().url().optional(),
    REDIS_URL: z.string().url().optional(),

    // API keys and secrets
    API_SECRET_KEY: z.string().min(16).optional(),

    // Monitoring and logging
    SENTRY_DSN: z.string().url().optional(),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

const processEnv = {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    API_SECRET_KEY: process.env.API_SECRET_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    LOG_LEVEL: process.env.LOG_LEVEL,
}

const parsed = envSchema.safeParse(processEnv)

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)

    // In production, fail fast on invalid environment
    if (process.env.NODE_ENV === 'production') {
        process.exit(1)
    }

    throw new Error('Invalid environment variables')
}

export const env = parsed.data

// Utility functions
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Security utilities
export const getSecureConfig = () => ({
    sessionSecret: env.SESSION_SECRET || 'fallback-secret-for-development-only',
    encryptionKey: env.ENCRYPTION_KEY || 'fallback-key-for-development-only',
    apiSecretKey: env.API_SECRET_KEY || 'fallback-api-key-for-development',
})

// Validation for required production environment variables
if (isProduction) {
    const requiredProdVars = ['SESSION_SECRET', 'ENCRYPTION_KEY', 'API_SECRET_KEY']
    const missingVars = requiredProdVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required production environment variables: ${missingVars.join(', ')}`
        )
    }
}