import { createContext } from 'react';

export const initialState = {
    currentNavigation: {},
    bannerMessage: '',
    bannerSeverity: ''
};

export const Context = createContext(initialState);
