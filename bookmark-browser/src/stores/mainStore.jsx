import React, { useReducer } from 'react';

import { Context, initialState } from '../contexts/mainContext.js';
import Reducer from './mainReducer'

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState, undefined);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export default Store;
