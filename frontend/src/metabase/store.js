/* @flow weak */

import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import { reducer as form } from "redux-form";
import { routerReducer as routing, routerMiddleware } from 'react-router-redux'

import promise from "redux-promise";
import logger from "redux-logger";

import { DEBUG } from "metabase/lib/debug";
import createOidcMiddleware, { createUserManager, loadUser } from 'redux-oidc';

import userManager from './auth/userManager';

/**
 * Provides the same functionality as redux-thunk and augments the dispatch method with
 * `dispatch.action(type, payload)` which creates an action that adheres to Flux Standard Action format.
 */
const thunkWithDispatchAction = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        const dispatchAugmented = Object.assign(dispatch, {
            action: (type, payload) => dispatch({ type, payload })
        });

        return action(dispatchAugmented, getState);
    }
    return next(action);
};

const devToolsExtension = window.devToolsExtension ? window.devToolsExtension() : (f => f);

export function getStore(reducers, history, intialState, enhancer = (a) => a) {

    const reducer = combineReducers({
        ...reducers,
        form,
        routing,
    });

    const middleware = [
        thunkWithDispatchAction,
        promise,
        ...(DEBUG ? [logger] : []),
        routerMiddleware(history),
        createOidcMiddleware(userManager, () => true, false, '/auth/callback')
    ];

    const store = createStore(reducer, intialState, compose(
        applyMiddleware(...middleware),
        devToolsExtension,
        enhancer,
    ));

    return store;
}