import Axios from 'axios';

export const login = (authHeader, reason = 'login') => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        },
        params: {
            reason
        }
    };

    return Axios.get(import.meta.env.VITE_API_URL + '/auth/login', config)
};
