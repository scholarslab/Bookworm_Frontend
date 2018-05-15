import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';
import './index.css';
import App from './containers/App';
// import registerServiceWorker from './registerServiceWorker';

// registerServiceWorker();
const target = document.getElementById('root');
console.log(Provider, ConnectedRouter);
render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    target
);
