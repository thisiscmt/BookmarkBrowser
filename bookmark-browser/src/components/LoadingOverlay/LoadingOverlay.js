import { Backdrop, CircularProgress } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
    backdrop: {
        position: 'absolute',
        zIndex: 100
    },

    progressIndicator: {
        color: '#ffffff'
    }
}));

const LoadingOverlay = (props) => {
    const { classes, cx } = useStyles();

    return (
        <Backdrop open={props.open} className={cx(classes.backdrop)} style={{ opacity: '0.6' }}>
            <CircularProgress className={cx(classes.progressIndicator)} />
        </Backdrop>
    );
};

export default LoadingOverlay
