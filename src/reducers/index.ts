import { combineReducers } from "redux";

import { routerReducer } from "react-router-redux";
import { sessions } from "./sessionsReducer";
import { create } from "./createReducer";

const rootReducer = combineReducers({
    routing: routerReducer,
    sessions,
    create
});

export default rootReducer;