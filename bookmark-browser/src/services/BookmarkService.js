import Axios from 'axios';

class BookmarkService {
    static getBookmarks = (authHeader, sessionToken, keyFetchToken) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            params: {
                sessionToken,
                keyFetchToken
            }
        };

        return Axios.get(process.env.REACT_APP_API_URL + '/bookmark', config)
    };

    static uploadBookmarkData = (bookmarkData, authHeader) => {
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

    static downloadBookmarkData = (authHeader) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            }
        };

        return Axios.get(process.env.REACT_APP_API_URL + '/bookmark/backup', config)
    };
}

export default BookmarkService;
