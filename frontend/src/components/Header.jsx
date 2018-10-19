import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import Contact from './Contact';
import Collapsible from 'react-collapsible';


export default class Header extends Component {
	render(){
		return(
			<div id="header">
			    <div style={{float: "right", position: "relative", zIndex: 2}}>
					{this.props.user ?
			    		<Collapsible trigger={this.props.user.username}> 
							<ul>
								<li><Link to="/">Home <span role="img">🏠</span></Link></li>
								<li><Link to="/notes">Notes <span role="img">🗒️</span></Link></li>
								<li><Link to="/contact">Contact <span role="img">📲</span></Link></li>
								<li><Link to="/changepassword">Reset Password <span role="img">📲</span></Link></li>
								<li><a href="#!" onClick={this.props.logout}>Logout <span role="img">🏃💨</span></a></li>
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
				<h2><span role="img">👋</span>note!</h2>
				<br/>
			</div>
		)
	}
}
