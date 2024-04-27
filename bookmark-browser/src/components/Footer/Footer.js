import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { colors } from '../../colors/colors';

const useStyles = makeStyles()(() => ({
    footerContainer: {
        paddingBottom: '20px'
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
}));

const Footer = (props) => {
    const { classes, cx } = useStyles(props);

    return (
        <footer className={cx(classes.footerContainer)}>
            <ul className={cx(classes.footerList)}>
                <li>
                    <Button
                        component={Link}
                        to='/'
                        className={cx(classes.footerLink)}
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
                        className={cx(classes.footerLink)}
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
                        className={cx(classes.footerLink)}
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
                        className={cx(classes.footerLink)}
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
