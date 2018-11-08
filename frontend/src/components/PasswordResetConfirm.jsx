import React, { Component } from 'react';
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";
import ReactTimeout from 'react-timeout'
import Errors from "./Errors";


class PasswordResetConfirm extends Component {
	state = {
		password: "",
		password2: "",
		submitStatus: false,
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.submitPasswordReset(this.state.password, this.state.password2, this.props.match.params.uidb64, this.props.match.params.token);
		this.setState({submitStatus: true});
	}

	render(){
		return(
			<div className="container-fluid">
				<div className="row text-center justify-content-center">
					<div className="col-12">
						{this.props.user_message && this.state.submitStatus && (
							<div>
								<div className="alert alert-success" role="alert">{this.props.user_message}</div>
								this.props.setTimeout(()=>return (<Redirect to="/"/>), 10000)
							</div>
						)}		
						{!this.state.submitStatus || this.props.errors.length ?
							<form onSubmit={this.onSubmit} className={this.props.errors.length && this.state.submitStatus ? "animated shake" : null}>
								<p style={{padding: '20px'}}>Please enter your new password twice.</p>
								<hr />
								<fieldset>
									{this.props.errors.length > 0 && this.state.submitStatus && (
										<Errors errors={this.props.errors} />
									)}		
									<div className="form-group">
										<label htmlFor="password">Your password</label>
										<input 
											className="form-control" 
											password="password" 
											id="password" 
											onChange={e => this.setState({password: e.target.value})}
											value={this.state.password}
											type="password"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="password2">Your password again</label>
										<input 
											className="form-control" 
											password2="password2" 
											id="password2" 
											onChange={e => this.setState({password2: e.target.value})}
											value={this.state.password2}
											type="password"
										/>
									</div>
								</fieldset>
								<br/>
								<button className="btn btn-primary" type="submit" value="Send">Submit</button>
							</form> 
						: null}
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
		submitPasswordReset: (password, password2, uidb64, token) => {
			return dispatch(auth.submitPasswordReset(password, password2, uidb64, token));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetConfirm);
