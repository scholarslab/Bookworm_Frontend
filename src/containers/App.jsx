import React from 'react';
import { Route } from 'react-router-dom';
import Bookworm from './Bookworm';

const App = () => (
    <main>
        <Route exact path="/" component={Bookworm} />
    </main>
);
export default App;