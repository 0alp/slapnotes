import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Switch, BrowserRouter, Redirect, matchPath} from 'react-router-dom';
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
import ChangePassword from './components/ChangePassword';
import ResetPassword from './components/ResetPassword';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import 'react-router-modal/css/react-router-modal.css';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import { LastLocationProvider, withLastLocation } from 'react-router-last-location';

let store = createStore(slapApp, applyMiddleware(thunk));

{/*modal route hack :( */}
class RenderBlocker extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !nextProps.block;
	}

	render() {
		return this.props.children;
	}
}

class RootContainerComponent extends Component {
	state = {
		shouldPageUpdate: true,
	}

	componentDidMount() {
		this.props.loadUser();
	}

	componentDidUpdate(prevProps) {
		{/*if (prevProps !== this.props) {
			const onModal = matchPath(window.location.pathname, { path: '/contact' }) !== null;
			this.setState({ shouldPageUpdate: !onModal });
		}*/}
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
		let {PrivateRoute, AsyncRoute, lastLocation} = this;
		return (
			<BrowserRouter>
			<LastLocationProvider>
				<div>
					<div>
						<ModalRoute 
							path="/login" 
							parentPath="/" 
							component={Login} 
							className='example-modal'
		  				    inClassName='example-modal-in'
						    outClassName='example-modal-out'
							backdropClassName='example-backdrop'
							backdropInClassName='example-backdrop-in'
							backdropOutClassName='example-backdrop-out'
							outDelay={500}
						/>
						<ModalRoute 
							path="/register" 
							parentPath="/" 
							component={Register} 
							className='example-modal'
		  				    inClassName='example-modal-in'
						    outClassName='example-modal-out'
							backdropClassName='example-backdrop'
							backdropInClassName='example-backdrop-in'
							backdropOutClassName='example-backdrop-out'
							outDelay={500}
						/>
						<ModalRoute
							parentPath={lastLocation} 
							path="/contact" 
							component={Contact} 
							className='example-modal'
		  				    inClassName='example-modal-in'
						    outClassName='example-modal-out'
							backdropClassName='example-backdrop'
							backdropInClassName='example-backdrop-in'
							backdropOutClassName='example-backdrop-out'
							outDelay={500}
							props = {{user: this.props.auth.user}}
						/>
						<ModalRoute
							path="/changepassword" 
							parentPath={(match) => {match.url}} 
							component={ChangePassword} 
							className='example-modal'
		  				    inClassName='example-modal-in'
						    outClassName='example-modal-out'
							backdropClassName='example-backdrop'
							backdropInClassName='example-backdrop-in'
							backdropOutClassName='example-backdrop-out'
							outDelay={500}
						/>
						<ModalRoute 
							path="/resetpassword" 
							parentPath={(match) => {match.url}} 
							component={ResetPassword} 
							className='example-modal'
		  				    inClassName='example-modal-in'
						    outClassName='example-modal-out'
							backdropClassName='example-backdrop'
							backdropInClassName='example-backdrop-in'
							backdropOutClassName='example-backdrop-out'
							outDelay={500}
						/>
						<ModalRoute 
							path="/password_reset_confirm/:uidb64/:token/" 
							component={PasswordResetConfirm} 
							parentPath="/" 
							className='example-modal'
		  				    inClassName='example-modal-in'
						    outClassName='example-modal-out'
							backdropClassName='example-backdrop'
							backdropInClassName='example-backdrop-in'
							backdropOutClassName='example-backdrop-out'
							outDelay={500}
						/>
						<RenderBlocker block={!this.state.shouldPageUpdate}>
							<Switch>
								<PrivateRoute path="/notes" component={SlapNote} />
								<AsyncRoute path="/" component={Home} />
								<Route component={NotFound} />
							</Switch>
						</RenderBlocker>
					</div>
					<div>
						<ModalContainer />
					</div>
				</div>
			</LastLocationProvider>
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
