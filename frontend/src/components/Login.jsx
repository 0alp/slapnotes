import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";


class Login extends Component {
	state = {
		username: "",
		password: "",
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.login(this.state.username, this.state.password);
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
								<legend>Login</legend>
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
								</p>

								<p>
									Don't have an account? <Link to="/register">Register</Link>
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
