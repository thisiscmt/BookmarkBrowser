import { useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import Bookmarks from './pages/Bookmarks/Bookmarks.jsx';
import Preferences from './pages/Preferences/Preferences.jsx';
import Config from './pages/Config/Config.jsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx';
import Store from './stores/mainStore.jsx';

function App() {
    // This ref is used to scroll to the top of the page after navigation is completed, as a convenience to the user in case the link they clicked
    // on is far down the given list of bookmarks
    const topOfPageRef = useRef();

    return (
        <div ref={topOfPageRef}>
            <Store>
                <BrowserRouter>
                    <div className='site-container'>
                        <Header />

                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/bookmarks' element={<Bookmarks ref={topOfPageRef} />} />
                            <Route path='/preferences' element={<Preferences />} />
                            <Route path='/config' element={<Config />} />
                            <Route path='*' element={<ErrorPage />} />
                        </Routes>

                        <Footer/>
                    </div>
                </BrowserRouter>
            </Store>
        </div>
    );
}

export default App;
