import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import Collapsible from 'react-collapsible';


export default class Header extends Component {
	render(){
		return(
			<div id="header">
			    <div style={{float: "right", position: "relative", zIndex: 2}}>
					{this.props.user ?
			    		<Collapsible trigger={this.props.user.username}> 
							<ul>
								<li><Link to="/">Home <span role="img" aria-label="home">🏠</span></Link></li>
								<li><Link to="/notes">Notes <span role="img" aria-label="notes">🗒️</span></Link></li>
								<li><Link to="/contact">Contact <span role="img" aria-label="contact">📨</span></Link></li>
								<li><Link to="/changepassword">Reset Password <span role="img" aria-label="reset password">📲</span></Link></li>
								<li><a href="#!" onClick={this.props.logout}>Logout <span role="img" aria-label="logout">🏃💨</span></a></li>
							</ul>
						</Collapsible>
					:
						<div>
							<p>
							<Link style={{float: "right"}} to="/login" component={Login}>Login</Link>
							<br />
							<Link to="/register" component={Register}>Register</Link></p>
						</div>
					}
			    </div>
				<Link to="/"><h2><span role="img">👋</span>note!</h2></Link>
				<br/>
			</div>
		)
	}
}
