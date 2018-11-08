import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";
import Errors from "./Errors";


class Login extends Component {
	state = {
		username: "",
		password: "",
		submitStatus: false
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.login(this.state.username, this.state.password);
		this.setState({submitStatus: true});
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.onRouteChanged();
		}
	}

	onRouteChanged() {
		this.setState({submitStatus: false});
	}

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />
		}

		return (
			<div className="container-fluid">
				<div className="row text-center justify-content-center">
					<div className="col-md-6 col-sm-12">
						<form onSubmit={this.onSubmit} className={this.props.errors.length && this.state.submitStatus ? "animated shake" : null}>
							<fieldset>	
								<legend>Login</legend>
								{this.props.errors.length > 0 && this.state.submitStatus && (
									<Errors errors={this.props.errors} />
								)}		
								<p>
									<label htmlFor="username">Username</label>
									<input
									className="form-control"
									type="text" id="username"
									onChange={e => this.setState({username: e.target.value})} />
								</p>
								<p>
									<label htmlFor="password">Password</label>
									<input
									className="form-control"
									type="password" id="password"
									onChange={e => this.setState({password: e.target.value})} />
								</p>
								<p>
									<button type="button submit" className="btn btn-primary">Login</button>
									<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.props.history.goBack())}>Back</button>
								</p>

								<p>
									Don't have an account? <Link to="/register">Register</Link>
								</p>
								<p>
									<Link to="/resetpassword">Forgot your password?</Link>
								</p>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		)
	}
}


const mapStateToProps = state => {
	let errors = [];
	if (state.auth.errors) {
		errors = Object.keys(state.auth.errors).map(field => {
			return {field, message: state.auth.errors[field]};
		});
	}
	return {
		errors,
		isAuthenticated: state.auth.isAuthenticated
	};
}

const mapDispatchToProps = dispatch => {
	return {
		login: (username, password) => {
			return dispatch(auth.login(username, password));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
