import React, {useEffect} from 'react';

const ErrorPage = () => {
    useEffect(() => {
        document.title = 'Error - Bookmark Browser';
    });

    return (
        <div className='content-container error-page'>
            <p>The page you are trying to reach can't be found.</p>
        </div>
    )
}

export default ErrorPage;
