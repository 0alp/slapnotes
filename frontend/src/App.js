import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import SlapNote from "./components/SlapNote";
import NotFound from "./components/NotFound";
import { Provider } from "react-redux";
import slapApp from "./reducers";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

let store = createStore(slapApp, applyMiddleware(thunk));

class App extends Component {
	render() {
		return (
	    	<Provider store={store}>
				<BrowserRouter>
	    			<Switch>
				      <Route exact path="/" component={SlapNote} />
				      <Route component={NotFound} />
				    </Switch>
		    	</BrowserRouter>
			</Provider>
    	);
	}
}

export default App;
