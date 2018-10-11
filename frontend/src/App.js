import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import SlapNote from "./components/SlapNote";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { Provider, connect } from "react-redux";
import slapApp from "./reducers";
import {auth} from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Login from "./components/Login";
import Register from "./components/Register";
import Contact from './components/Contact';
import 'react-router-modal/css/react-router-modal.css';
import { ModalContainer, ModalRoute } from 'react-router-modal';

let store = createStore(slapApp, applyMiddleware(thunk));

class RootContainerComponent extends Component {

	componentDidMount() {
		this.props.loadUser();
	}

	PrivateRoute = ({component: ChildComponent, ...rest}) => {
		return <Route {...rest} render={props => {
			if (this.props.auth.isLoading) {
				return <em>Loading...</em>;
			} else if (!this.props.auth.isAuthenticated) {
				return <Redirect to="/login" />;
			} else {
				return <ChildComponent {...props} />
		  	}
		}} />
	}

	AsyncRoute = ({component: ChildComponent, ...rest}) => {
		return <Route {...rest} render={props => {
			if (this.props.auth.isLoading) {
				return <em>Loading...</em>;
			} else {
				return <ChildComponent {...props} />
		  	}
		}} />
	}

	render() {
		let {PrivateRoute, AsyncRoute} = this;
		return (
			<BrowserRouter>
				<div>
					<div>
						<Switch>
							<AsyncRoute exact path="/" component={Home} />
							<PrivateRoute exact path="/notes" component={SlapNote} />
							<ModalRoute exact path="/login" parentPath="/" component={Login} />
							<ModalRoute exact path="/register" parentPath="/" component={Register} />
							<ModalRoute exact path="/contact" parentPath={(match) => {match.url}} component={Contact} />
							<Route component={NotFound} />
						</Switch>
					</div>
					<div>
						<ModalContainer />
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

const mapStateToProps = state => {
	return {
		auth: state.auth,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		loadUser: () => {
			return dispatch(auth.loadUser());
		}
	}
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<RootContainer />
			</Provider>
		)
	}
}
