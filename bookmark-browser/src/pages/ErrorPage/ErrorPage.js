import React, {useEffect} from 'react';
import {Box} from '@material-ui/core';

const ErrorPage = () => {
    useEffect(() => {
        document.title = 'Error - Bookmark Browser';
    });

    return (
        <Box className='error-page'>
            <p>The page you are trying to reach can't be found</p>
        </Box>
    )
}

export default ErrorPage;
