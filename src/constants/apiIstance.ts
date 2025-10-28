import axios, { InternalAxiosRequestConfig, CreateAxiosDefaults } from 'axios'

export const apiInstance = {
    create: (configDefault?: CreateAxiosDefaults) => {
        const api = axios.create(configDefault)
        api.interceptors.request.use((config) => {
            return {
                ...config,
                headers: {
                    Authorization: "Bearer "// Sử dụng userParse ở đây
                },
            } as unknown as InternalAxiosRequestConfig
        })
        return api
    },
}