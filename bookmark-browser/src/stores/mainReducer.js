const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_NAVIGATION':
            return {
                ...state,
                currentNavigation: action.payload
            };
        case 'SET_BANNER_MESSAGE':
            return {
                ...state,
                bannerMessage: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;
