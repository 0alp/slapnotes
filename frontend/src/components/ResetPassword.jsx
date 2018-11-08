import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {email} from "../actions";
import Errors from "./Errors";


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
						{this.props.user_message && this.state.submitStatus && (
							<div>
								<div className="alert alert-success" role="alert">{this.props.user_message}</div>
							</div>
						)}		
					</div>
					<div className="col-md-6 col-sm-12">
					{!this.state.submitStatus || this.props.errors.length ? 
						<form onSubmit={this.onSubmit} className={this.props.errors.length && this.state.submitStatus ? "animated shake" : null}>
							<legend>Reset Password</legend>
							<fieldset>	
								{this.props.errors.length > 0 && (
									<div>
										<Errors errors={this.props.errors} />
									</div>
								)}
								<p>
									<label htmlFor="email">Email</label>
									<input
									className="form-control"
									type="email" 
									id="email"
									value={this.state.email}
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
						{this.props.isSending ? <div><i className="fas fa-cog fa-3x fa-spin"></i></div> : null}
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
		isSending: state.email.isSending,
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
