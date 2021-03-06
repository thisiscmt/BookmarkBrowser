import {useContext, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import { Context } from '../../stores/mainStore';
import SharedService from '../../services/SharedService';

const styles = makeStyles({
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
        background: '#396b9e',
        borderColor: '#1f3a56',
        borderRadius: '4px',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: 'bold',
        margin: '8px',
        padding: '8px 0 8px 0'
    },

    msgPanel: {
        color: 'red',
        fontSize: '14px',
        marginBottom: 0,
        marginTop: '16px',
        textAlign: 'center'
    }
});

const Header = (props) => {
    const classes = styles(props);
    const location = useLocation();

    const getCurrentPage = (location) => {
        let curPage = location.pathname.replace(/\//g, '');

        if (curPage) {
            curPage = curPage[0].toUpperCase() + curPage.substr(1);
        } else {
            curPage = 'Home';
        }

        return curPage;
    }

    const [ currentPage, setCurrentPage] = useState(getCurrentPage(location));
    const [ headerText, setHeaderText] = useState(SharedService.getHeaderText(currentPage, 'Root'));
    const [state, dispatch] = useContext(Context);
    const dataService = state.dataService;
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
            const lastKnownDirectoryOnStartup = !!dataService.getApplicationData('LastKnownDirectoryOnStartup');

            if (lastKnownDirectoryOnStartup) {
                newCurrentDirectory = dataService.getApplicationData('CurrentDirectory');
            }
        }

        setCurrentPage(newCurrentPage);
        setHeaderText(SharedService.getHeaderText(newCurrentPage, newCurrentDirectory));
        dispatch({ type: 'SET_BANNER_MESSAGE', payload: ''})
    }, [location, currentNavigation, dataService, dispatch, setCurrentPage, setHeaderText]);

    const goToPriorLevel = () => {
        dispatch({
            type: 'SET_CURRENT_NAVIGATION',
            payload: {
                action: 'GoToPriorLevel',
                node: dataService.getSessionData('CurrentNode'),
                directory: dataService.getSessionData('CurrentDirectory')
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
            <div className={classes.headerContainer}>
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
                <div className={classes.msgPanel}>
                    {state.bannerMessage}
                </div>
            }
        </header>
    );
}

export default Header;
