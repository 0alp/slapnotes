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
								<li><Link to="/notes">Notes</Link></li>
								<li><Link to="/">Home</Link></li>
								<li><a href="#!" onClick={this.props.logout}>Logout</a></li>
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
