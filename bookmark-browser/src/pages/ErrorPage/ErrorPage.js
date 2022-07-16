import React, {useEffect} from 'react';

const ErrorPage = () => {
    useEffect(() => {
        document.title = 'Error - Bookmark Browser';
    });

    return (
        <main className='error-page'>
            <p>The page you are trying to reach can't be found</p>
        </main>
    )
}

export default ErrorPage;
