import React, { Component } from 'react';
import {Link} from 'react-router-dom';


export default class Contact extends Component {
	render(){
		return(
			<div>
			    <div className="row">
					<div className="col-12 text-center">
						<form action="https://formspree.io/mike@slaponic.us" method="POST" style={{padding: "10px"}}>
							<p style={{padding: '20px'}}>Have any questions or concerns? Contact us using the form below and we will get back to you ASAP!</p>
							<hr />
							<fieldset>
							<div className="form-group">
								<label htmlFor="emailname">Your Name</label>
								<input className="form-control" name="emailname" id="emailname" type="text"/>
							</div>
							<div className="form-group">
								<label htmlFor="emailreply">Your Email</label>
								<input className="form-control"name="emailreply" id="emailreply" type="email"/>
							</div>
							<div className="form-group">
								<label htmlFor="emailmessage">Message</label>
								<textarea className="form-control"name="emailmessage" id="emailmessage"></textarea>
							</div>
							</fieldset>
							<br/>
							<button className="btn btn-primary" type="submit" value="Send">Submit</button>
							<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.props.history.goBack())}>Back</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
