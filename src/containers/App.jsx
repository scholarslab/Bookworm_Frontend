import React from 'react';
import { Route } from 'react-router-dom';
import Bookworm from './Bookworm';
import Navbar from '../components/Navbar'

const App = () => (
    <div>
        <Navbar />
        <Route exact path="/" component={Bookworm} />
    </div>
);
export default App;