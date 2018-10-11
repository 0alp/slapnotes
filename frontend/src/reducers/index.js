import { combineReducers } from 'redux';
import notes from "./notes";
import auth from "./auth";
import profile from "./profile";

const slapApp = combineReducers({
	notes, auth, profile
})

const rootReducer = (state, action) => {

	if ( action.type === 'AUTHENTICATION_ERROR' || action.type === 'LOGOUT_SUCCESSFUL' ) {
		state = undefined;
	}
	return slapApp(state, action);
}

export default rootReducer;
