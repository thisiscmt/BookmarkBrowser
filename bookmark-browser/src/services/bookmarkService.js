import Axios from 'axios';

export const getBookmarks = (authHeader) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        }
    };

    return Axios.get(process.env.REACT_APP_API_URL + '/bookmark', config)
};

export const uploadBookmarkData = (bookmarkData, authHeader) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        }
    };

    const data = {
        bookmarkData,
        timestamp: new Date().getTime()
    }

    return Axios.put(process.env.REACT_APP_API_URL + '/bookmark/backup', data, config)
};

export const downloadBookmarkData = (authHeader) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        }
    };

    return Axios.get(process.env.REACT_APP_API_URL + '/bookmark/backup', config)
};
