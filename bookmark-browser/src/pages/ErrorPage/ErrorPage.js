import React, {useEffect} from 'react';

const ErrorPage = () => {
    useEffect(() => {
        document.title = 'Error - Bookmark Browser';
    });

    return (
        <section>
            <p>The page you are trying to reach can't be found</p>
        </section>
    )
}

export default ErrorPage;
