import { useContext, useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/styles';
import {DateTime} from 'luxon';

import { Context } from '../../stores/mainStore';
import SharedService from '../../services/SharedService';
import AuthService from '../../services/AuthService';
import BookmarkService from '../../services/BookmarkService';
import { DataSources } from '../../enums/DataSources';

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

    dataSourceLabel: {
        marginRight: '16px'
    },

    statsLabel: {
        textDecoration: 'underline',
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

    dataSourceOptions: {
        paddingBottom: '2px',
        paddingTop: '2px'
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
    const [ dataSource, setDataSource ] = useState(DataSources.Sync);
    const [ lastLoginTimestamp, setLastLoginTimestamp ] = useState(null);
    const [ verified, setVerified ] = useState(false);
    const [ sessionToken, setSessionToken ] = useState('');
    const [ keyFetchToken, setKeyFetchToken ] = useState('');
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ hasBookmarkData, setHasBookmarkData ] = useState(!!state.dataService.getApplicationData('BookmarkData'));
    const [ bookmarkCount, setBookmarkCount ] = useState(state.dataService.getApplicationData('BookmarkCount') ?
        state.dataService.getApplicationData('BookmarkCount') :
        0
    );
    const [ bookmarkTimestamp, setBookmarkTimestamp ] = useState(state.dataService.getApplicationData('BookmarkTimestamp') ?
        state.dataService.getApplicationData('BookmarkTimestamp') :
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

    const handleLogin = async () => {
        const passwordToUse = passwordChanged ? password : state.dataService.getApplicationData('Password');
        const authHeader = 'Basic ' + window.btoa(userName + ':' + passwordToUse);
        const loginResponse = await AuthService.login(authHeader);

        setSessionToken(loginResponse.data.sessionToken);
        setKeyFetchToken(loginResponse.data.keyFetchToken);
        setVerified(loginResponse.data.verified);
        setLastLoginTimestamp(loginResponse.data.authAt);
    };

    const handleUploadBookmarkData = () =>{
        if (userName && password) {
            const reader = new FileReader();
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: '' });

            reader.onload = async (event) => {
                const passwordToUse = passwordChanged ? password : state.dataService.getApplicationData('Password');
                const authHeader = 'Basic ' + window.btoa(userName + ':' + passwordToUse);

                try {
                    await BookmarkService.uploadBookmarkData(event.target.result, authHeader);
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

    const handleRefreshData = async () =>{
        if (userName && password) {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: '' });
            const passwordToUse = passwordChanged ? password : state.dataService.getApplicationData('Password');
            const authHeader = 'Basic ' + window.btoa(userName + ':' + passwordToUse);
            let response;

            try {
                if (dataSource === DataSources.Sync) {
                    if (!(sessionToken && keyFetchToken && verified)) {
                        dispatch({ type: 'SET_BANNER_MESSAGE', payload: 'Login is required' });
                        return;
                    }

                    response = await BookmarkService.getBookmarks(authHeader, sessionToken, keyFetchToken);
                } else if (dataSource === DataSources.Backup) {
                    response = await BookmarkService.downloadBookmarkData(authHeader);
                }

                const timestamp = Number(response.data.timestamp);
                state.dataService.setApplicationData('UserName', userName);

                if (passwordChanged) {
                    state.dataService.setApplicationData('Password', password);
                }

                state.dataService.setApplicationData('BookmarkData', response.data.bookmarkData);
                state.dataService.setApplicationData('BookmarkCount', response.data.count);
                state.dataService.setApplicationData('BookmarkTimestamp', timestamp);

                setHasBookmarkData(true);
                setBookmarkCount(response.data.count);
                setBookmarkTimestamp(timestamp);
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
                        classes={{ root: classes.textFieldLabelRoot, label: classes.textFieldLabel }}
                        labelPlacement='start'
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
                        classes={{ root: classes.textFieldLabelRoot, label: classes.textFieldLabel }}
                        labelPlacement='start'
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

            <div className={classes.section}>
                <FormControl fullWidth={SharedService.isMobile()}>
                    <FormControlLabel
                        classes={{ root: classes.textFieldLabelRoot, label: `${classes.textFieldLabel} ${classes.dataSourceLabel}` }}
                        labelPlacement='start'
                        label='Data source:'
                        control={
                            <RadioGroup row={true} name="DataSource" value={dataSource} onChange={event => setDataSource(event.target.value)}>
                                <FormControlLabel
                                    value={DataSources.Sync}
                                    label="Sync"
                                    control={<Radio color='primary' className={classes.dataSourceOptions} />}
                                />
                                <FormControlLabel
                                    value={DataSources.Backup}
                                    label="Bookmark backup"
                                    control={<Radio color='primary' className={classes.dataSourceOptions} />}
                                />
                            </RadioGroup>
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
                        <span>
                            {
                                DateTime.fromMillis(bookmarkTimestamp).toLocaleString({
                                    ...DateTime.DATE_MED,
                                    ...DateTime.TIME_SIMPLE,
                                    month: 'long'
                                })
                            }
                        </span>
                    </div>
                </div>
            }

            {
                dataSource === DataSources.Sync &&
                <div className={classes.section}>
                    <Button variant='contained' size='small' color='primary' className={classes.actionButton} onClick={handleLogin}>
                        Login
                    </Button>

                    {
                        lastLoginTimestamp &&
                        <div className={classes.section}>
                            <div>
                                <span className={classes.statsLabel}>Last login</span>
                                <span>
                                    {
                                        DateTime.fromMillis(lastLoginTimestamp).toLocaleString({
                                            ...DateTime.DATE_MED,
                                            ...DateTime.TIME_SIMPLE,
                                            month: 'long'
                                        })
                                    }
                                </span>
                            </div>

                            <div>
                                <span className={classes.statsLabel}>Verified?</span>
                                <span>{verified ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    }
                </div>

            }

            {
                dataSource === DataSources.Backup && !SharedService.isMobile() &&
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
                    onClick={handleRefreshData}>Refresh
                </Button>
            </div>
        </section>
    );
}

export default Config;
