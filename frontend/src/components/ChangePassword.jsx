import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";


class ChangePassword extends Component {
	state = {
		old_password: "",
		new_password: "",
		new_password2: "",
		submitStatus: false,
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.changePassword(this.state.new_password, this.state.new_password2, this.state.old_password);
		this.setState({submitStatus: true});
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.onRouteChanged();
		}
	}

	onRouteChanged() {
		this.setState({submitStatus: false});
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row text-center justify-content-center">
					<div className="col-12">
						{this.props.errors.length > 0 && (
							<div>
								<div className="alert alert-danger" role="alert">
									<strong>Uh-oh! Looks like there are some errors with your submission</strong>
									{this.props.errors.map(error => (
										<div>
											<span>{error.field}: </span><span>{error.message}</span>
										</div>
									))}
								</div>
							</div>
							)}
							{this.props.user_message && this.state.submitStatus && (
								<div>
									<div className="alert alert-success" role="alert">{this.props.user_message}</div>
								</div>
							)}		
					</div>
					<div className="col-md-6 col-sm-12">
					{!this.state.submitStatus || this.props.errors.length ? 
						<form onSubmit={this.onSubmit}>
							<fieldset>	
								<legend>Login</legend>
								<p>
									<label htmlFor="username">Old Password</label>
									<input
									className="form-control"
									type="password" id="old_password"
									onChange={e => this.setState({old_password: e.target.value})} />
								</p>
								<p>
									<label htmlFor="password">New Password</label>
									<input
									className="form-control"
									type="password" id="new_password"
									onChange={e => this.setState({new_password: e.target.value})} />
								</p>
								<p>
									<label htmlFor="password">New Password (again)</label>
									<input
									className="form-control"
									type="password" id="new_password2"
									onChange={e => this.setState({new_password2: e.target.value})} />
								</p>	
								<p>
									<button type="button submit" className="btn btn-primary">Change Password</button>
								</p>
							</fieldset>
						</form> : null }
						<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.props.history.goBack())}>Back</button>
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
		user_message: state.auth.user_message
	};
}

const mapDispatchToProps = dispatch => {
	return {
		changePassword: (new_password, new_password2, old_password) => {
			return dispatch(auth.changePassword(new_password, new_password2, old_password));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
