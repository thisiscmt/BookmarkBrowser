import { useRef } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

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

                        <Switch>
                            <Route exact path='/'>
                                <Home />
                            </Route>
                            <Route exact path='/bookmarks'>
                                <Bookmarks ref={topOfPageRef} />
                            </Route>
                            <Route exact path='/preferences'>
                                <Preferences />
                            </Route>
                            <Route exact path='/config'>
                                <Config />
                            </Route>
                            <Route>
                                <ErrorPage />
                            </Route>
                        </Switch>

                        <Footer/>
                    </Paper>
                </BrowserRouter>
            </Store>
        </main>
    );
}

export default App;
