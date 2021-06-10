import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import appConfigReducer from "./reducers/appConfig";
import screenStore from "./reducers/screenStore";
import authReducer from "./reducers/auth";

const rootReducer = combineReducers({
	appConfig: appConfigReducer,
	screensData: screenStore,
	auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
