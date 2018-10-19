import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";


class ResetPassword extends Component {
	state = {
		email: "",
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.resetPassword(this.state.email);
	}

	render() {
		return (
			<div className="container-fluid">
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
									<label htmlFor="email">Email</label>
									<input
									className="form-control"
									type="email" id="email"
									onChange={e => this.setState({email: e.target.value})} />
								</p>	
								<p>
									<button type="button submit" className="btn btn-primary">Submit</button>
									<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.props.history.goBack())}>Back</button>
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
		errors
	};
}

const mapDispatchToProps = dispatch => {
	return {
		resetPassword: (email) => {
			return dispatch(auth.resetPassword(email));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
