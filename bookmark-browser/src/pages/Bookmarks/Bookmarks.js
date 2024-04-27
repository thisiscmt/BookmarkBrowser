import { forwardRef, useContext, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';

import { Context } from '../../stores/mainStore';
import Bookmark from '../../components/Bookmark/Bookmark';
import * as DataService from '../../services/dataService';
import { TypeCodes } from '../../enums/TypeCodes';
import { AlertSeverity } from '../../enums/AlertSeverity';
import { STORAGE_BOOKMARK_DATA } from '../../constants/constants';
import { colors } from '../../colors/colors';

const useStyles = makeStyles()(() => ({
    topLevelHeader: {
        backgroundColor: '#fadb4e',
        borderColor: '#f7c942',
        borderTopColor: '#999',
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        fontWeight: 'bold',
        padding: '7px 14px',
        textAlign: 'left',
        textShadow: 'rgb(255, 255, 255) 0px 1px 0px'
    },

    bookmarkList: {
        listStyleImage: 'none',
        listStylePosition: 'outside',
        listStyleType: 'none',
        margin: 0,
        padding: 0
    },

    bookmark: {
        backgroundAttachment: 'scroll',
        backgroundClip: 'border-box',
        backgroundColor: colors.bookmarkBackground,
        backgroundImage: 'none',
        backgroundOrigin: 'padding-box',
        backgroundPosition: '0% 0%',
        backgroundPositionX: '0%',
        backgroundPositionY: '0%',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto auto',
        borderBottomColor: colors.bookmarkBorder,
        borderBottomStyle: 'solid',
        borderBottomWidth: 0,
        borderLeftColor: colors.bookmarkBorder,
        borderLeftStyle: 'solid',
        borderLeftWidth: 0,
        borderRightColor: colors.bookmarkBorder,
        borderRightStyle: 'solid',
        borderRightWidth: 0,
        borderTopColor: colors.bookmarkBorder,
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        color: 'rgb(51, 51, 51)',
        textAlign: 'left'
    },

    separator: {
        borderTop: `1px solid ${colors.bookmarkBorder}`,
        borderBottom: `4px solid ${colors.bookmarkBackground}`
    }
}));

const Bookmarks = forwardRef((props, ref) => {
    const { classes, cx } = useStyles(props);
    const [ bookmarkToolbar, setBookmarkToolbar ] = useState([]);
    const [ bookmarkMenu, setBookmarkMenu ] = useState([]);
    const [ topLevel, setTopLevel ] = useState(false);
    const [state, dispatch] = useContext(Context);
    const currentNavigation = state.currentNavigation;

    useEffect(() => {
        document.title = 'Bookmarks - Bookmark Browser';

        if (DataService.getApplicationData(STORAGE_BOOKMARK_DATA)) {
            const currentBookmarks = DataService.getCurrentBookmarks(currentNavigation)

            setBookmarkToolbar(currentBookmarks.bookmarkToolbar);
            setBookmarkMenu(currentBookmarks.bookmarkMenu);
            setTopLevel(currentBookmarks.topLevel);

            // This ref will be for an element in the Header component, and will allow us to scroll to the top if the user clicked on a directory
            // way down in the list
            ref.current.scrollIntoView();
        } else {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: 'Go to the Config page to refresh your bookmark data', severity: AlertSeverity.Info} })
        }
    }, [currentNavigation, ref, dispatch, setBookmarkToolbar, setBookmarkMenu, setTopLevel])

    const getBookmarkElement = (bookmark, index) => {
        let listElement;

        if (bookmark.typeCode === TypeCodes.Separator) {
            listElement = (
                <li key={index} className={cx(classes.separator)} />
            );
        } else {
            listElement = (
                <li key={index} className={cx(classes.bookmark)}>
                    <Bookmark key={index} bookmark={bookmark}/>
                </li>
            );
        }

        return listElement;
    };

    return (
        <div className='bookmark-content-container'>
            <ul className={cx(classes.bookmarkList)}>
                {
                    topLevel === true &&
                    <li className={cx(classes.topLevelHeader)}>Bookmarks Toolbar</li>
                }
                {
                    bookmarkToolbar.map((bookmark, index) => {
                        return getBookmarkElement(bookmark, index);
                    })
                }

                {
                    topLevel === true &&
                    <li className={cx(classes.topLevelHeader)}>Bookmarks Menu</li>
                }
                {
                    bookmarkMenu.map((bookmark, index) => {
                        return getBookmarkElement(bookmark, index);
                    })
                }
            </ul>
        </div>
    );
});

export default Bookmarks;

