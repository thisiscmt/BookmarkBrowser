import { useContext, useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import * as Moment from 'moment';

import SharedService from '../../services/SharedService';
import { Context } from '../../stores/mainStore';

const styles = makeStyles({
    section: {
        marginTop: '16px'
    },

    textFieldLabelRoot: {
        marginRight: '16px'
    },

    textFieldLabel: {
        fontSize: '0.875rem',
        fontWeight: 'bold',
        marginRight: '8px',
        minWidth: '90px',
        textAlign: 'left'
    },

    statsLabel: {
        marginRight: '12px'
    },

    fileUploadLabel: {
        cursor: 'pointer',
        marginRight: '8px'
    },

    fileUploadInput: {
        display: 'none'
    },

    selectedFile: {
        fontStyle: 'italic',
        marginBottom: '12px'
    },

    actionButton: {
        backgroundColor: '#396B9E'
    }
});

const Config = (props) => {
    const classes = styles(props);

    const [state, dispatch] = useContext(Context);
    const [ userName, setUserName ] = useState(state.dataService.getApplicationData('UserName') ?
        state.dataService.getApplicationData('UserName') :
        ''
    );
    const [ password, setPassword ] = useState(state.dataService.getApplicationData('Password') ? '********' : '');
    const [ passwordChanged, setPasswordChanged ] = useState(false);
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ hasBookmarkData, setHasBookmarkData ] = useState(!!state.dataService.getApplicationData('BookmarkData'));
    const [ bookmarkCount, setBookmarkCount ] = useState(state.dataService.getApplicationData('BookmarkCount') ?
        state.dataService.getApplicationData('BookmarkCount') :
        0
    );
    const [ uploadTimestamp, setUploadTimestamp ] = useState(state.dataService.getApplicationData('UploadTimestamp') ?
        state.dataService.getApplicationData('UploadTimestamp') :
        0
    );

    useEffect(() => {
        document.title = 'Config - Bookmark Browser';
    });

    const handleChangeUserName = (event) => {
        setUserName(event.target.value);
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
        setPasswordChanged(true);
    }

    const handleSelectFile = (event) => {
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUploadBookmarkData = () =>{
        if (userName && password) {
            const reader = new FileReader();
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: '' });

            reader.onload = async (event) => {
                const passwordToUse = passwordChanged ? password : state.dataService.getApplicationData('Password');
                const authHeader = 'Basic ' + btoa(userName + ':' + passwordToUse);

                try {
                    await state.dataService.uploadBookmarkData(event.target.result, authHeader);
                    state.dataService.setApplicationData('UserName', userName);

                    if (passwordChanged) {
                        state.dataService.setApplicationData('Password', password);
                    }

                    setSelectedFile(null);
                    dispatch({ type: 'SET_BANNER_MESSAGE', payload: 'Bookmark data uploaded successfully' });
                } catch (error) {
                    dispatch({ type: 'SET_BANNER_MESSAGE', payload: SharedService.getErrorMessage(error) });
                }
            };

            reader.readAsText(selectedFile);
        }
        else {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: 'You must provide a user name and password' });
        }
    };

    const handleDownloadBookmarkData = async () =>{
        if (userName && password) {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: '' });
            const passwordToUse = passwordChanged ? password : state.dataService.getApplicationData('Password');
            const authHeader = 'Basic ' + btoa(userName + ':' + passwordToUse);

            try {
                const response = await state.dataService.downloadBookmarkData(authHeader);
                const timestamp = Number(response.data.uploadTimestamp);
                state.dataService.setApplicationData('UserName', userName);

                if (passwordChanged) {
                    state.dataService.setApplicationData('Password', password);
                }

                state.dataService.setApplicationData('BookmarkData', response.data.bookmarkData);
                state.dataService.setApplicationData('BookmarkCount', response.data.count);
                state.dataService.setApplicationData('UploadTimestamp', timestamp);

                setHasBookmarkData(true);
                setBookmarkCount(response.data.count);
                setUploadTimestamp(timestamp);
                dispatch({ type: 'SET_BANNER_MESSAGE', payload: 'Bookmark data refreshed successfully' });
            } catch (error) {
                dispatch({ type: 'SET_BANNER_MESSAGE', payload: SharedService.getErrorMessage(error) });
            }
        }
        else {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: 'You must provide a username and password' });
        }
    };

    return (
        <section className='content-container'>
            <div className={classes.section}>
                <FormControl fullWidth={SharedService.isMobile()}>
                    <FormControlLabel
                        classes={{
                            root: classes.textFieldLabelRoot,
                            label: classes.textFieldLabel
                        }}
                        labelPlacement={'start'}
                        label='User name:'
                        control={
                            <TextField
                                id='UserName'
                                type='email'
                                autoComplete='email username'
                                margin='none'
                                variant='outlined'
                                name='userName'
                                value={userName}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 50 }}
                                onChange={handleChangeUserName}
                            />
                        }
                    />
                </FormControl>
            </div>

            <div className={classes.section}>
                <FormControl fullWidth={SharedService.isMobile()}>
                    <FormControlLabel
                        classes={{
                            root: classes.textFieldLabelRoot,
                            label: classes.textFieldLabel
                        }}
                        labelPlacement={'start'}
                        label='Password:'
                        control={
                            <TextField
                                id='UserName'
                                type='password'
                                autoComplete='current-password'
                                margin='none'
                                variant='outlined'
                                name='password'
                                value={password}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 50 }}
                                onChange={handleChangePassword}
                            />
                        }
                    />
                </FormControl>
            </div>

            {
                hasBookmarkData &&
                <div className={classes.section}>
                    <div>
                        <span className={classes.statsLabel}>Bookmarks:</span>
                        <span>{bookmarkCount.toLocaleString('en')}</span>
                    </div>

                    <div>
                        <span className={classes.statsLabel}>Timestamp:</span>
                        <span>{new Moment(uploadTimestamp).local().format('MMMM D, YYYY h:mm a')}</span>
                    </div>
                </div>
            }

            {
                !SharedService.isMobile() &&
                <div className={classes.section}>
                    {
                        selectedFile &&
                        <div className={classes.selectedFile}>{ selectedFile.name }</div>
                    }

                    <label htmlFor='FileUpload' className={classes.fileUploadLabel}>Browse
                        <input
                            type='file'
                            id='FileUpload'
                            name='file'
                            className={classes.fileUploadInput}
                            onChange={handleSelectFile}
                            accept='.json'
                        />
                    </label>
                    <Button
                        variant='outlined'
                        color='default'
                        size='small'
                        disabled={!selectedFile}
                        onClick={handleUploadBookmarkData}
                    >
                        Upload
                    </Button>
                </div>
            }

            <div className={classes.section}>
                <Button
                    className={classes.actionButton}
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={handleDownloadBookmarkData}>Refresh
                </Button>
            </div>
        </section>
    );
}

export default Config;
