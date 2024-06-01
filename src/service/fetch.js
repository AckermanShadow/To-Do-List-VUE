import axios from 'axios'
const fetch = axios.create({
    baseURL: `http://127.0.0.1:8000/api`,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
});

export default fetch