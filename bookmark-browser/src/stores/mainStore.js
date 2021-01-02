import React, {createContext, useReducer} from 'react';

import Reducer from './mainReducer'
import DataService from '../services/DataService';

const initialState = {
    dataService: new DataService(),
    currentNavigation: {},
    bannerMessage: ''
};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState, undefined);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);

export default Store;
