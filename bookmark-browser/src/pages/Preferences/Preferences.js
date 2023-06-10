import { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';

import {Context} from '../../stores/mainStore';
import * as DataService from '../../services/dataService';
import {AlertSeverity} from '../../enums/AlertSeverity';
import {STORAGE_PREFS_GO_TO_LAST_DIRECTORY} from '../../constants/constants';

const styles = makeStyles({
    checkboxes: {
        '& span': {
            padding: '0 4px 0 0'
        }
    }
});

const Preferences = (props) => {
    const classes = styles(props);
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
        <main className='content-container'>
            <div className='form-field'>
                <FormControlLabel
                    classes={{
                        root: classes.checkboxes
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
        </main>
    );
}

export default Preferences;
