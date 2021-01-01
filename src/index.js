import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap';
import './css/global.css';
import './scss/_spacing.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import Store from './store'

const feather = require('feather-icons')

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

feather.replace()

