import axios from 'axios';

export function request(url, method, data = [])
{
    const API_URL = 'http://offshorly.local/api' // Your api hostname here

    return axios({
        url: `${API_URL}/${url}`,
        method,
        data,
    })
}
