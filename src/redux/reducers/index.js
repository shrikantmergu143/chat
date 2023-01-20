import { combineReducers } from "redux";
import { chatReducers } from "./chatReducers";

const reducers = combineReducers({
    allReducers: chatReducers,
})

export default reducers;