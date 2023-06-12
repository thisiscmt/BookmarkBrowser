import {useContext, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/styles';

import { Context } from '../../stores/mainStore';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import { STORAGE_CURRENT_DIRECTORY, STORAGE_CURRENT_NODE, STORAGE_PREFS_GO_TO_LAST_DIRECTORY } from '../../constants/constants';
import { colors } from '../../colors/colors';

const useStyles = makeStyles({
    headerContainer: {
        backgroundColor: '#5e87b0',
        borderColor: '#456f9a',
        borderStyle: 'solid',
        borderWidth: 0,
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        display: 'flex',
        justifyContent: 'space-between'
    },

    headerText: {
        color: '#ffffff',
        fontSize: '18px',
        margin: 0,
        padding: '16px',
        textAlign: 'center',
        width: '100%'
    },

    navButton: {
        background: colors.primaryBackground,
        borderColor: colors.navLinkBorder,
        borderRadius: '4px',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: 'bold',
        margin: '8px',
        padding: '8px 0 8px 0'
    },
});

const Header = (props) => {
    const classes = useStyles(props);
    const location = useLocation();

    const getCurrentPage = (location) => {
        let curPage = location.pathname.replace(/\//g, '');

        if (curPage) {
            curPage = curPage[0].toUpperCase() + curPage.substring(1);
        } else {
            curPage = 'Home';
        }

        return curPage;
    }

    const [ currentPage, setCurrentPage] = useState(getCurrentPage(location));
    const [ headerText, setHeaderText] = useState(SharedService.getHeaderText(currentPage, 'Root'));
    const [state, dispatch] = useContext(Context);
    const currentNavigation = state.currentNavigation;

    // We update various pieces of the UI and clear any previous banner message upon each route change
    useEffect(() => {
        const newCurrentPage = getCurrentPage(location);
        let newCurrentDirectory;

        if (currentNavigation && Object.keys(currentNavigation).length > 0) {
            if (currentNavigation.action === 'GoToPriorLevel' && currentNavigation.node) {
                let path = currentNavigation.node.path.split("\\");

                if (path.length > 3) {
                    path.splice(path.length - 1, 1);
                    newCurrentDirectory = path.join('\\');
                }
            } else if (currentNavigation.action === 'GoToDirectory') {
                newCurrentDirectory = currentNavigation.directory;
            }
        } else {
            // If there is no current nav data then we are at app startup, so we check if we should go to a saved current directory
            const lastKnownDirectoryOnStartup = !!DataService.getApplicationData(STORAGE_PREFS_GO_TO_LAST_DIRECTORY);

            if (lastKnownDirectoryOnStartup) {
                newCurrentDirectory = DataService.getApplicationData(STORAGE_CURRENT_DIRECTORY);
            }
        }

        setCurrentPage(newCurrentPage);
        setHeaderText(SharedService.getHeaderText(newCurrentPage, newCurrentDirectory));
        dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: ''} })
    }, [location, currentNavigation, dispatch, setCurrentPage, setHeaderText]);

    const goToPriorLevel = () => {
        dispatch({
            type: 'SET_CURRENT_NAVIGATION',
            payload: {
                action: 'GoToPriorLevel',
                node: JSON.parse(DataService.getSessionData(STORAGE_CURRENT_NODE)),
                directory: DataService.getSessionData(STORAGE_CURRENT_DIRECTORY)
            }
        });
    }

    const goToTop = () => {
        dispatch({
            type: 'SET_CURRENT_NAVIGATION',
            payload: {
                action: 'GoToTop',
                node: null,
                directory: ''
            }
        });
    }

    return (
        <header>
            <div data-testid="header-container" className={classes.headerContainer}>
                {
                    (currentPage === 'Bookmarks') &&
                    <Button id='BackButton' className={classes.navButton} onClick={goToPriorLevel}>Back</Button>
                }

                <h5 className={classes.headerText}>{headerText}</h5>

                {
                    (currentPage === 'Bookmarks') &&
                    <Button id='GoToTopButton' className={classes.navButton} onClick={goToTop}>Top</Button>
                }
            </div>

            {
                state.bannerMessage &&
                <>
                    <Fade in={!!state.bannerMessage}>
                        <Alert severity={state.bannerSeverity}>{state.bannerMessage}</Alert>
                    </Fade>
                </>
            }
        </header>
    );
}

export default Header;
