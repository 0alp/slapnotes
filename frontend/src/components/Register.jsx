import React, {Component} from "react";
import {connect} from "react-redux";

import {Link, Redirect} from "react-router-dom";

import {auth} from "../actions";

class Login extends Component {

	state = {
		username: "",
		password: "",
		email: "",
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.register(this.state.username, this.state.password, this.state.email);
	}

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />
		}
		return (
			<div className="containeri-fluid">
				<div className="row text-center justify-content-center">
					<div className="col-md-6 col-sm-12">
						<form onSubmit={this.onSubmit}>
							<fieldset>
								<legend>Register</legend>
								{this.props.errors.length > 0 && (
									<div>
										{this.props.errors.map(error => (
										<div className="alert alert-danger" role="alert" key={error.field}>{error.message}</div>
										))}
									</div>
								)}
								<p>
									<label htmlFor="username">Username</label>
									<input
									type="text" id="username"
									className="form-control"
									onChange={e => this.setState({username: e.target.value})} />
								</p>
								<p>
									<label htmlFor="password">Password</label>
									<input
									type="password" id="password"
									className="form-control"
									onChange={e => this.setState({password: e.target.value})} />
								</p>
								<p>
									<label htmlFor="email">Email</label>
									<input
									type="email" id="email"
									className="form-control"
									onChange={e => this.setState({email: e.target.value})} />
								</p>

								<p>
									<button type="button submit" className="btn btn-primary">Register</button>
									<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.props.history.goBack())}>Back</button>
								</p>

								<p>
									Already have an account? <Link to="/login">Login</Link>
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
		register: (username, password, email) => dispatch(auth.register(username, password, email)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
