import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import reducers from "../reducer";
import RootSaga from "../saga";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const configureStore = (initialState) => {
    const store = createStore(
        reducers,
        initialState,
        applyMiddleware(...middlewares)
    );

    sagaMiddleware.run(RootSaga);

    return store;
};

const store = configureStore();

export default store;
