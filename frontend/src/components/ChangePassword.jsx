import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";


class ChangePassword extends Component {
	state = {
		old_password: "",
		new_password: "",
		new_password2: "",
	}

	onSubmit = e => {
		e.preventDefault();
		if (this.state.new_password === this.state.new_password2){
			this.props.changePassword(this.state.old_password, this.state.new_password);
		}
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
		changePassword: (old_password, new_password) => {
			return dispatch(auth.changePassword(old_password, new_password));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
