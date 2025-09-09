import { AlertSeverity } from '../enums/AlertSeverity';

const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_NAVIGATION':
            return {
                ...state,
                currentNavigation: action.payload
            };
        case 'SET_BANNER_MESSAGE':{
            let severity = AlertSeverity.Info;

            if (action.payload.severity) {
                severity = action.payload.severity;
            }

            return {
                ...state,
                bannerMessage: action.payload.message,
                bannerSeverity: severity
            };
        }
        default:
            return state;
    }
};

export default Reducer;
