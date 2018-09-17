import React, { Component } from 'react';

export default class Header extends Component {
	render(){
		return(
			<div id="header">
			    <div style={{float: "right"}}>
			    	<strong>{this.props.username} (<a href="#!" onClick={this.props.logout}>logout</a>)</strong>
			    </div>
				<h2><span role="img">👋</span>note!</h2>
				<hr/>
			</div>
		)
	}
}
