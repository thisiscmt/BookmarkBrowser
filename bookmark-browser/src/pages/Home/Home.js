import { useEffect } from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
    welcomeText: {
        marginTop: 0
    },

    content: {
        paddingLeft: '10px',
        paddingRight: '10px',
    }
}));

const Home = (props) => {
    const { classes, cx } = useStyles();

    useEffect(() => {
        document.title = 'Home - Bookmark Browser';
    });

    return (
        <main className='content-container'>
            <div>
                <h3 className={cx(classes.welcomeText)}>Welcome to the Bookmark Browser</h3>
            </div>

            <div className={cx(classes.content)}>
                This app provides an easy way to navigate through and use your Sync bookmarks on a mobile device.
            </div>
        </main>
    )
}

export default Home;
