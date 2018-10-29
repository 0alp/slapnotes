import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {email} from "../actions";


class ResetPassword extends Component {
	state = {
		email: "",
		submitStatus: false
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.resetPassword(this.state.email);
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
											{error.message}
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
							<legend>Reset Password</legend>
							<fieldset>	
								<p>
									<label htmlFor="email">Email</label>
									<input
									className="form-control"
									type="email" id="email"
									onChange={e => this.setState({email: e.target.value})} />
								</p>	
								<p>
									Submit your email address and we'll email you a password reset form.
								</p>
								<p>
									<button type="button submit" className="btn btn-primary">Submit</button>
								</p>
							</fieldset>
						</form>: null}
						<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.props.history.goBack())}>Back</button>
					</div>
				</div>
			</div>
		)
	}
}


const mapStateToProps = state => {
	let errors = [];
	if (state.email.errors) {
		errors = Object.keys(state.email.errors).map(field => {
			return {field, message: state.email.errors[field]};
		});
	}
	return {
		errors, 
		user_message: state.email.user_message
	};
}

const mapDispatchToProps = dispatch => {
	return {
		resetPassword: (email_addr) => {
			return dispatch(email.sendResetPasswordEmail(email_addr));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
