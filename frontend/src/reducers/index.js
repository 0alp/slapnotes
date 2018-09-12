import { combineReducers } from 'redux';
import notes from "./notes";

const slapApp = combineReducers({
	notes,
})

export default slapApp;
