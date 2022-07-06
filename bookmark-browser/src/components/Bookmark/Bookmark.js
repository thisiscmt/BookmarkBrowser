import { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { Context } from '../../stores/mainStore';
import { TypeCodes } from '../../enums/TypeCodes';
import folderImage from '../../images/folder.png';
import bookmarkImage from '../../images/bookmark.png';

const styles = makeStyles({
    bookmarkBlock: {
        alignItems: 'center',
        display: 'flex',

        '& a': {
            '&:link, &:visited, &:active': {
                color: '#337ab7'
            },

            '&:hover': {
                color: '#23527c'
            }
        }
    },

    imageBlock: {
        padding: '15px 10px 11px 10px'
    },

    linkBlock: {
        minWidth: 0,
        width: '100%'
    },

    directoryBlock: {
        fontSize: '13px',
        fontWeight: 'bold',
        padding: '14px 0 14px 0'
    },

    nameBlock: {
        fontSize: '13px',
        fontWeight: 'bold',
        paddingTop: '6px'
    },

    locationBlock: {
        fontSize: '12px',
        fontWeight: 'normal',
        overflow: 'hidden',
        paddingBottom: '6px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },

    bookmarkImage: {
        paddingTop: '1px'
    },

    bookmarkDirectoryLink: {
        backgroundColor: 'transparent',
        border: 0,
        color: '#337ab7',
        cursor: 'pointer',
        outline: 'none',
        padding: 0,
        textAlign: 'left',
        width: '100%'
    }
});

const Bookmark = (props) => {
    const classes = styles(props);
    const bookmark = props.bookmark;
    const [, dispatch] = useContext(Context);

    const goToDirectory = (event, bookmark) => {
        event.preventDefault();

        dispatch({
            type: 'SET_CURRENT_NAVIGATION',
            payload: {
                action: 'GoToDirectory',
                node: bookmark,
                directory: bookmark.path
            }
        });
    };

    return (
        <div className={classes.bookmarkBlock}>
            <div className={classes.imageBlock}>
                <img
                    alt='Item icon'
                    src={bookmark.typeCode === TypeCodes.Directory ? folderImage : bookmarkImage}
                    className={bookmark.typeCode === TypeCodes.Bookmark ? classes.bookmarkImage : ''}
                />
            </div>

            <div className={classes.linkBlock}>
                {
                    bookmark.typeCode === TypeCodes.Directory &&
                    <button className={classes.bookmarkDirectoryLink} onClick={(event) => goToDirectory(event, bookmark)}>
                        <div className={classes.directoryBlock}>{bookmark.title}</div>
                    </button>
                }

                {
                    bookmark.typeCode === TypeCodes.Bookmark &&
                    // Using the ref property to set the href is needed since the URL could be a bookmarklet, and React will eventually ban
                    // 'javascript:' type href values for anchors
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a className='no-decoration'
                       ref={node => node && node.setAttribute('href', bookmark.uri)}
                       rel='noreferrer'
                       target='_blank'
                    >
                        <div className={classes.nameBlock}>{bookmark.title}</div>
                        <div className={classes.locationBlock}>{bookmark.uri}</div>
                    </a>
                }
            </div>
        </div>
    );
}

export default Bookmark;
