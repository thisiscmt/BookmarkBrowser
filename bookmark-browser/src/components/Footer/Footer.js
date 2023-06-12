import {Link} from 'react-router-dom';
import { Button } from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

import { colors } from '../../colors/colors';

const useStyles = makeStyles({
    footerContainer: {
        marginBottom: '20px'
    },

    footerList: {
        border: 0,
        display: 'flex',
        justifyContent: 'space-between',
        margin: 0,
        padding: 0,

        '& li': {
            width: '25%'
        }
    },

    footerLink: {
        background: colors.primaryBackground,
        borderColor: colors.navLinkBorder,
        borderWidth: '1px',
        borderRadius: '2px',
        borderStyle: 'solid',
        color: '#FFFFFF',
        display: 'block',
        fontSize: '13px',
        fontWeight: 'bold',
        overflow: 'hidden',
        padding: '18px 4px 18px 4px',
        textAlign: 'center',
        textDecoration: 'none',
        textOverflow: 'ellipsis',
        textTransform: 'none',

        '&:hover': {
            background: '#417BB5'
        }
    }
});

const Footer = (props) => {
    const classes = useStyles(props);

    return (
        <footer className={classes.footerContainer}>
            <ul className={classes.footerList}>
                <li>
                    <Button
                        component={Link}
                        to='/'
                        className={classes.footerLink}
                        variant='outlined'
                        disableRipple={true}
                    >
                        Home
                    </Button>
                </li>
                <li>
                    <Button
                        component={Link}
                        to='/bookmarks'
                        className={classes.footerLink}
                        variant='outlined'
                        disableRipple={true}
                    >
                        Bookmarks
                    </Button>
                </li>
                <li>
                    <Button
                        component={Link}
                        to='/preferences'
                        className={classes.footerLink}
                        variant='outlined'
                        disableRipple={true}
                    >
                        Preferences
                    </Button>
                </li>
                <li>
                    <Button
                        component={Link}
                        to='/config'
                        className={classes.footerLink}
                        variant='outlined'
                        disableRipple={true}
                    >
                        Config
                    </Button>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;
