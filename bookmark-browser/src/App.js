import { useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Paper } from '@mui/material';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Preferences from './pages/Preferences/Preferences';
import Config from './pages/Config/Config';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Store from './stores/mainStore';
import './App.scss';

function App() {
    // This ref is used to scroll to the top of the page after navigation is completed, as a convenience to the user in case the link they clicked
    // on is far down the given list of bookmarks
    const topOfPageRef = useRef();

    return (
        <main ref={topOfPageRef}>
            <Store>
                <BrowserRouter>
                    <Paper elevation={5}>
                        <Header />

                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/bookmarks' element={<Bookmarks ref={topOfPageRef} />} />
                            <Route path='/preferences' element={<Preferences />} />
                            <Route path='/config' element={<Config />} />
                            <Route path='*' element={<ErrorPage />} />
                        </Routes>

                        <Footer/>
                    </Paper>
                </BrowserRouter>
            </Store>
        </main>
    );
}

export default App;
