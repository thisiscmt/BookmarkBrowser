import { useContext, useEffect, useState } from 'react';
import { Button, Fade, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay.jsx';
import { Context } from '../../contexts/mainContext.js';
import * as SharedService from '../../services/sharedService';
import * as DataService from '../../services/dataService';
import * as BookmarkService from '../../services/bookmarkService';
import { DataSources } from '../../enums/DataSources';
import { AlertSeverity } from '../../enums/AlertSeverity';
import {
    STORAGE_BOOKMARK_COUNT,
    STORAGE_BOOKMARK_DATA,
    STORAGE_BOOKMARK_TIMESTAMP,
    STORAGE_PASSWORD,
    STORAGE_USER_NAME,
    DEMO_USER_NAME
} from '../../constants/constants';
import { colors } from '../../colors/colors';

const useStyles = makeStyles()(() => ({
    section: {
        marginTop: '16px'
    },

    textFieldLabelRoot: {
        marginRight: '16px'
    },

    textFieldLabel: {
        fontSize: '14px',
        fontWeight: 500,
        marginRight: '8px',
        minWidth: '90px',
        textAlign: 'right'
    },

    dataSourceLabel: {
        marginRight: '16px'
    },

    statsLabel: {
        fontSize: '14px',
        fontWeight: 500,
        marginRight: '12px'
    },

    fileUploadLabel: {
        cursor: 'pointer',
        marginRight: '12px',
        textDecoration: 'underline'
    },

    fileUploadInput: {
        display: 'none'
    },

    selectedFile: {
        fontStyle: 'italic',
        marginBottom: '12px'
    },

    dataSource: {
        justifyContent: 'center'
    },

    dataSourceOption: {
        padding: '5px'
    },

    timestamp: {
        marginTop: '4px'
    },

    actionButton: {
        backgroundColor: colors.primaryBackground
    }
}));

const Config = (props) => {
    const { classes, cx } = useStyles(props);
    const [ userName, setUserName ] = useState(DataService.getApplicationData(STORAGE_USER_NAME) ? DataService.getApplicationData(STORAGE_USER_NAME) : '');
    const [ password, setPassword ] = useState(DataService.getApplicationData(STORAGE_PASSWORD) ? '********' : '');
    const [ passwordChanged, setPasswordChanged ] = useState(false);
    const [ dataSource, setDataSource ] = useState(DataSources.Backup);
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ hasBookmarkData, setHasBookmarkData ] = useState(!!DataService.getApplicationData(STORAGE_BOOKMARK_DATA));
    const [ bookmarkCount, setBookmarkCount ] = useState(Number(DataService.getApplicationData(STORAGE_BOOKMARK_COUNT)) ?
        Number(DataService.getApplicationData(STORAGE_BOOKMARK_COUNT)) :
        0
    );
    const [ bookmarkTimestamp, setBookmarkTimestamp ] = useState(Number(DataService.getApplicationData(STORAGE_BOOKMARK_TIMESTAMP)) ?
        Number(DataService.getApplicationData(STORAGE_BOOKMARK_TIMESTAMP)) :
        0
    );
    const [ loading, setLoading ] = useState(false);
    const [, dispatch] = useContext(Context);

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
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: ''} });

            reader.onload = async (event) => {
                const passwordToUse = passwordChanged ? password : DataService.getApplicationData(STORAGE_PASSWORD);
                const authHeader = 'Basic ' + window.btoa(userName + ':' + passwordToUse);

                try {
                    setLoading(true);
                    await BookmarkService.uploadBookmarkData(event.target.result, authHeader);
                    DataService.setApplicationData(STORAGE_USER_NAME, userName);

                    if (passwordChanged) {
                        DataService.setApplicationData(STORAGE_PASSWORD, password);
                    }

                    setSelectedFile(null);
                    dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: 'Bookmark data uploaded successfully', severity: AlertSeverity.Success} });
                } catch (error) {
                    dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: SharedService.getErrorMessage(error), severity: AlertSeverity.Error} });
                } finally {
                    setLoading(false);
                }
            };

            reader.readAsText(selectedFile);
        }
        else {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: 'You must provide a user name and password', severity: AlertSeverity.Warning} });
        }
    };

    const handleRefreshData = async () =>{
        if (userName && password) {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: ''} });
            const passwordToUse = passwordChanged ? password : DataService.getApplicationData(STORAGE_PASSWORD);
            const authHeader = 'Basic ' + window.btoa(userName + ':' + passwordToUse);
            let response;

            try {
                setLoading(true);

                if (dataSource === DataSources.Sync) {
                    response = await BookmarkService.getBookmarks(authHeader);
                } else if (dataSource === DataSources.Backup) {
                    response = await BookmarkService.downloadBookmarkData(authHeader);
                }

                const timestamp = Number(response.data.timestamp);
                DataService.setApplicationData(STORAGE_USER_NAME, userName);

                if (passwordChanged) {
                    DataService.setApplicationData(STORAGE_PASSWORD, password);
                }

                DataService.setApplicationData(STORAGE_BOOKMARK_DATA, JSON.stringify(response.data.bookmarkData));
                DataService.setApplicationData(STORAGE_BOOKMARK_COUNT, response.data.count);
                DataService.setApplicationData(STORAGE_BOOKMARK_TIMESTAMP, timestamp);

                setHasBookmarkData(true);
                setBookmarkCount(response.data.count);
                setBookmarkTimestamp(timestamp);

                dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: 'Bookmark data refreshed successfully', severity: AlertSeverity.Success} });
            } catch (error) {
                dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: SharedService.getErrorMessage(error), severity: AlertSeverity.Error} });
            } finally {
                setLoading(false);
            }
        }
        else {
            dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: 'You must provide a user name and password', severity: AlertSeverity.Warning} });
        }
    };

    const getBookmarkTimestampFormatted = () => {
        let bookmarkTimestampFormatted;

        if (bookmarkTimestamp) {
            const now = new Date(Number(bookmarkTimestamp));

            const dateOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };

            const timeOptions = {
                timeZoneName: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            };

            bookmarkTimestampFormatted = `${new Intl.DateTimeFormat(undefined, dateOptions).format(now)} at ${new Intl.DateTimeFormat(undefined, timeOptions).format(now)}`;
        }

        return bookmarkTimestampFormatted;
    }

    const bookmarkTimestampFormatted = getBookmarkTimestampFormatted();

    return (
        <div className='content-container loadable-container'>
            <LoadingOverlay open={loading} />

            <div>
                <FormControl fullWidth={SharedService.isMobile()}>
                    <FormControlLabel
                        classes={{ root: cx(classes.textFieldLabelRoot), label: cx(classes.textFieldLabel) }}
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

            <div className={cx(classes.section)}>
                <FormControl fullWidth={SharedService.isMobile()}>
                    <FormControlLabel
                        classes={{ root: cx(classes.textFieldLabelRoot), label: cx(classes.textFieldLabel) }}
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

            <div className={cx(classes.section)}>
                <FormControl fullWidth={SharedService.isMobile()}>
                    <FormControlLabel
                        classes={{ root: cx(classes.textFieldLabelRoot), label: `${cx(classes.textFieldLabel)} ${cx(classes.dataSourceLabel)}` }}
                        className={cx(classes.dataSource)}
                        labelPlacement='start'
                        label='Data source:'
                        control={
                            <RadioGroup row={true} name="DataSource" value={dataSource} onChange={event => setDataSource(event.target.value)}>
                                {/*<FormControlLabel*/}
                                {/*    value={DataSources.Sync}*/}
                                {/*    label="Sync"*/}
                                {/*    control={<Radio color='primary' className={cx(classes.dataSourceOptions)} />}*/}
                                {/*/>*/}
                                <FormControlLabel
                                    value={DataSources.Backup}
                                    label="Bookmark backup"
                                    control={<Radio color='primary' className={cx(classes.dataSourceOption)} />}
                                />
                            </RadioGroup>
                        }
                    />
                </FormControl>
            </div>

            {
                hasBookmarkData &&
                <div className={cx(classes.section)}>
                    <div>
                        <span className={cx(classes.statsLabel)}>Bookmarks:</span>
                        <span>{bookmarkCount.toLocaleString('en')}</span>
                    </div>

                    <div className={cx(classes.timestamp)}>
                        <span className={cx(classes.statsLabel)}>Timestamp:</span>
                        <span>{bookmarkTimestampFormatted}</span>
                    </div>
                </div>
            }

            {
                dataSource === DataSources.Backup && !SharedService.isMobile() &&
                <Fade in={dataSource === DataSources.Backup && !SharedService.isMobile()} timeout={600}>
                    <div className={cx(classes.section)}>
                        {
                            selectedFile &&
                            <div className={cx(classes.selectedFile)}>{ selectedFile.name }</div>
                        }

                        <label htmlFor='FileUpload' className={cx(classes.fileUploadLabel)}>Browse
                            <input
                                type='file'
                                id='FileUpload'
                                name='file'
                                className={cx(classes.fileUploadInput)}
                                onChange={handleSelectFile}
                                accept='.json'
                            />
                        </label>

                        <Button
                            variant='outlined'
                            color='secondary'
                            size='small'
                            disabled={!selectedFile || userName === DEMO_USER_NAME}
                            onClick={handleUploadBookmarkData}
                        >
                            Upload
                        </Button>
                    </div>
                </Fade>
            }

            <div className={cx(classes.section)}>
                <Button
                    className={cx(classes.actionButton)}
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={handleRefreshData}>Refresh
                </Button>
            </div>
        </div>
    );
}

export default Config;
