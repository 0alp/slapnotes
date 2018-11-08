import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";
import Errors from "./Errors";

class Login extends Component {

	state = {
		username: "",
		password: "",
		email: "",
		submitStatus: false,
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.register(this.state.username, this.state.password, this.state.email);
		this.setState({submitStatus: true})
	}

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />
		}

		return (
			<div className="containeri-fluid">
				<div className="row text-center justify-content-center">
					<div className="col-md-6 col-sm-12">
						<form onSubmit={this.onSubmit} className={this.props.errors.length && this.state.submitStatus ? "animated shake" : null}>
							<fieldset>
								<legend>Register</legend>
								{this.props.errors.length > 0 && this.state.submitStatus && (
									<Errors errors={this.props.errors} />
								)}
								{this.props.user_message && this.state.submitStatus && (
									<div>
										<div className="alert alert-success" role="alert">{this.props.user_message}</div>
									</div>
								)}		
								{!this.state.submitStatus || this.props.errors.length ?
								<div>
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
								</p>

								<p>
									Already have an account? <Link to="/login">Login</Link>
								</p> 
								</div> : null}
								<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.props.history.goBack())}>Back</button>
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
