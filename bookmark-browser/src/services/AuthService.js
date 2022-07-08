import Axios from 'axios';

class AuthService {
    static login = (authHeader, reason = 'login') => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            params: {
                reason
            }
        };

        return Axios.get(process.env.REACT_APP_API_URL + '/auth/login', config)
    };
}

export default AuthService
