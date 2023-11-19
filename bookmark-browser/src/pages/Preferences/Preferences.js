import { useContext, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { Context } from '../../stores/mainStore';
import * as DataService from '../../services/dataService';
import { AlertSeverity } from '../../enums/AlertSeverity';
import { STORAGE_PREFS_GO_TO_LAST_DIRECTORY } from '../../constants/constants';

const useStyles = makeStyles()(() => ({
    checkboxes: {
        '& span': {
            padding: '0 4px 0 0'
        }
    }
}));

const Preferences = (props) => {
    const { classes, cx } = useStyles(props);
    const [ goToLastKnownDirectory, setGoToLastKnownDirectory] = useState(!!DataService.getApplicationData(STORAGE_PREFS_GO_TO_LAST_DIRECTORY));
    const [, dispatch] = useContext(Context);

    useEffect(() => {
        document.title = 'Preferences - Bookmark Browser';
    });

    const savePreferences = (event) => {
        setGoToLastKnownDirectory(event.target.checked);
        DataService.setApplicationData(STORAGE_PREFS_GO_TO_LAST_DIRECTORY, event.target.checked);
        dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: 'Preferences saved', severity: AlertSeverity.Success} });
    }

    return (
        <div className='content-container'>
            <div>
                <FormControlLabel
                    classes={{
                        root: cx(classes.checkboxes)
                    }}
                    control={
                        <Checkbox
                            id='LastKnownDirectoryOnStartup'
                            color='primary'
                            checked={goToLastKnownDirectory}
                            onChange={savePreferences}
                        />
                    }
                    label='Remember last known directory'
                />
            </div>
        </div>
    );
}

export default Preferences;
