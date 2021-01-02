import {makeStyles} from '@material-ui/styles';
import {useEffect} from 'react';

const styles = makeStyles({
    welcomeText: {
        marginTop: 0
    }
});

const Home = (props) => {
    const classes = styles(props);

    useEffect(() => {
        document.title = 'Home - Bookmark Browser';
    });

    return (
        <section className='content-container'>
            <div>
                <h3 className={classes.welcomeText}>Welcome to the Bookmark Browser</h3>
            </div>

            <div>
                This application provides an easy way to navigate through and use your Sync bookmarks on a mobile device.
            </div>
        </section>
    )
}

export default Home;
