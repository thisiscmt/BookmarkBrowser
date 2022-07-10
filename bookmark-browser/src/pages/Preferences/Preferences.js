import {useContext, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {Context} from '../../stores/mainStore';
import {AlertSeverity} from '../../enums/AlertSeverity';

const styles = makeStyles({
    checkboxes: {
        '& span': {
            padding: '0 4px 0 0'
        }
    }
});

const Preferences = (props) => {
    const classes = styles(props);
    const [state, dispatch] = useContext(Context);

    const savePreferences = (event) => {
        setGoToLastKnownDirectory(event.target.checked);
        state.dataService.setApplicationData('LastKnownDirectoryOnStartup', event.target.checked);
        dispatch({ type: 'SET_BANNER_MESSAGE', payload: {message: 'Preferences saved', severity: AlertSeverity.Success} });
    }

    const [ goToLastKnownDirectory, setGoToLastKnownDirectory] = useState(state.dataService.getApplicationData('LastKnownDirectoryOnStartup'));

    useEffect(() => {
        document.title = 'Preferences - Bookmark Browser';
    });

    return (
        <section className='content-container'>
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
                    label='Go to last directory upon startup'
                />
            </div>
        </section>
    );
}

export default Preferences;
