import React, { Component } from 'react';
import Header from "./Header";
import Register from "./Register";
import Footer from "./Footer";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {auth} from "../actions";

class Home extends Component {

	render(){
		return(
			<div style={{overflow: "hidden", width: "100%"}}>
				<Header user={this.props.user} logout={this.props.logout} />
				<section className="text-center">
					<h1>Welcome to <span role="img">👋</span>note!</h1>
					<p>
						A notetaking app for programmers and humans
					</p>
					<div className="row">
						<div className="col-12">
						{this.props.user ?
							<button className="btn btn-primary"><Link to="/notes" component={Register}>Go to your notes</Link></button>
						:
							<button className="btn btn-primary"><Link to="/register" component={Register}>Register Now!</Link></button>
						}
						</div>
					</div>
				</section>
				<section className="ss-style-doublediagonal">
					<div className="row">
						<div className="col-4">
							<h3>Vim-inspired colorschemes</h3>
							<i className="fas fa-palette fa-10x"></i>
							<p>Are you used to the colors in your terminal? Edit your notes in a variety of colorschemes with basic Markdown syntax highlighting.</p>
						</div>
						<div className="col-4">
							<h3>Live markdown editor</h3>
							<i className="fab fa-markdown fa-10x"></i>
							<p>Edit your notes in Markdown, the standard markup language used across the web. Supports original, vanilla, and Github flavors.</p>
						</div>
						<div className="col-4">
							<h3>Fully responsive layout</h3>
							<div className="row">
								<div className="col-12">
									<i className="fas fa-desktop fa-5x"></i>
								</div>
								<div className="col-6">
									<i className="fas fa-mobile fa-5x"></i>
								</div>
								<div className="col-6">
									<i className="fas fa-tablet fa-5x"></i>
								</div>
							</div>
							<p>Designed with a mobile-first philosophy, slapnote can be used on a variety of devices and platforms.</p>
						</div>
					</div>
				</section>
				<section className="ss-style-doublediagonal-rev">
					<div className="row">
						<div className="col-3">
							<h4>FOSS - Free and Open-Source</h4>
							<p>Review (almost) every line of code, contribute, or suggest improvements on Github! Better yet, fork the project and create your own clone!</p>
						</div>
						<div className="col-3">
							<h4>Simplicity first</h4>
							<p>There's nothing to set up - just create an account and go!</p>
						</div>
						<div className="col-3">
							<h4>Fully responsive layout</h4>
						</div>
						<div className="col-3">
							<h4>Professional yet FUN</h4>
						</div>
					</div>
				</section>
				<Footer />
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => dispatch(auth.logout()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
