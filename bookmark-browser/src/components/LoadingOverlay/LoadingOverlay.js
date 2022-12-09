import {Backdrop, CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    backdrop: {
        position: 'absolute',
        zIndex: 100
    },

    progressIndicator: {
        color: '#ffffff'
    }
});

const LoadingOverlay = (props) => {
    const classes = useStyles();

    return (
        <Backdrop open={props.open} className={classes.backdrop} style={{ opacity: '0.6' }}>
            <CircularProgress className={classes.progressIndicator} />
        </Backdrop>
    );
};

export default LoadingOverlay
