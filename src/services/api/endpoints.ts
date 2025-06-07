// src/services/api/endpoints.ts
export const API_ENDPOINTS = {
    // Auth
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        me: '/auth/me',
    },

    // Users
    users: {
        list: '/users',
        detail: (id: string) => `/users/${id}`,
        create: '/users',
        update: (id: string) => `/users/${id}`,
        delete: (id: string) => `/users/${id}`,
    },

    // Students
    students: {
        list: '/students',
        detail: (id: string) => `/students/${id}`,
        create: '/students',
        update: (id: string) => `/students/${id}`,
        delete: (id: string) => `/students/${id}`,
        grades: (id: string) => `/students/${id}/grades`,
    },

    // Courses
    courses: {
        list: '/courses',
        detail: (id: string) => `/courses/${id}`,
        create: '/courses',
        update: (id: string) => `/courses/${id}`,
        delete: (id: string) => `/courses/${id}`,
        enroll: (id: string) => `/courses/${id}/enroll`,
    },

    // Add more endpoints as needed
} as const