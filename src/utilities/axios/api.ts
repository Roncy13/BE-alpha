import axios, { AxiosInstance } from 'axios';

export default class Api {
    private axios: AxiosInstance;

    constructor(baseURL: string, options: {} = {}) {
        this.axios = axios.create({
            baseURL,
            headers: options,
            timeout: 3600
        })
    }

    protected async get(endpoint: string, params: {} = {}) {
        const res = await this.axios.get(endpoint, {
            params
        });

        return res;
    }
}