import 'style';
import es6Promise from 'es6-promise';
import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router';
import cookie from 'react-cookie';
import {tokenKey, docTitle} from 'data/config';

import {routes} from 'component/App.jsx';


/* The real main part */
////////////////////////////////////////////////////////////

es6Promise.polyfill();
/* Setup page title */
window.document.title = docTitle;

render(<Router routes={routes} />, document.getElementById('app'));
