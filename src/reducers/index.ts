import { combineReducers } from "redux";

import { routerReducer } from "react-router-redux";
import { sessions } from "./sessionsReducer";

const rootReducer = combineReducers({
    routing: routerReducer,
    sessions
});

export default rootReducer;