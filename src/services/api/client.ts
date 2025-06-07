// src/services/api/client.ts
import axios from 'axios'
import { env } from '@/config/env'

export const apiClient = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Log requests in development
        if (env.NEXT_PUBLIC_APP_ENV === 'development') {
            console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        if (env.NEXT_PUBLIC_APP_ENV === 'development') {
            console.log(`✅ Response:`, response.data)
        }
        return response
    },
    async (error) => {
        if (env.NEXT_PUBLIC_APP_ENV === 'development') {
            console.error(`❌ Error:`, error.response?.data || error.message)
        }

        // Handle common errors
        if (error.response?.status === 401) {
            // Clear auth and redirect to login
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)