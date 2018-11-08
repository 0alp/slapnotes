import React, { Component } from 'react';
import {Link} from 'react-router-dom';


export default class Footer extends Component {
	render(){
		return(
			<div id="footer" style={this.props.style}>
			    <div className="row">
					<div className="col-12 text-center">
						<h6>Check us out elsewhere on the web!</h6>
						<a href="https://github.com/slaponicus/slapnotes" target="_blank"><i className="fab fa-github"></i></a>
						<Link to="/contact"><i className="fas fa-envelope"></i></Link>
					</div>
				</div>
			</div>
		)
	}
}
