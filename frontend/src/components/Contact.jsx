import React, { Component } from 'react';
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {email} from "../actions";


class Contact extends Component {
	state = {
		name: "",
		reply: "",
		message: "",
		submitStatus: false
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.sendContactEmail(this.state.name, this.state.reply, this.state.message);
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

	render(){
		return(
			<div>
			    <div className="row">
					<div className="col-12 text-center">
						{this.props.errors.length > 0 && this.state.submitStatus && (
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
						{!this.state.submitStatus || this.props.errors.length ?
							<form onSubmit={this.onSubmit} style={{padding: "10px"}}>
								<p style={{padding: '20px'}}>Have any questions or concerns? Contact us using the form below and we will get back to you ASAP!</p>
								<hr />
								<fieldset>
								<div className="form-group">
									<label htmlFor="name">Your Name</label>
									<input 
										className="form-control" 
										name="name" 
										id="name" 
										onChange={e => this.setState({name: e.target.value})}
										type="text"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="reply">Your reply email</label>
									<input 
										className="form-control" 
										reply="reply" 
										id="reply" 
										onChange={e => this.setState({reply: e.target.value})}
										type="text"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="message">Your message</label>
									<input 
										className="form-control" 
										message="message" 
										id="message" 
										onChange={e => this.setState({message: e.target.value})}
										type="text"
									/>
								</div>
								</fieldset>
								<br/>
								<button className="btn btn-primary" type="submit" value="Send">Submit</button>
							</form> 
						: null}
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
		sendContactEmail: (name, reply, message) => {
			return dispatch(email.sendContactEmail(name, reply, message));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
