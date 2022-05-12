import axios from 'axios';

export function request(url, method, data = [])
{
    const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

    return axios({
        url: `${API_URL}/${url}`,
        method,
        data,
    })
}
