import React, { Component } from 'react';
import Header from "./Header";
import Register from "./Register";
import Footer from "./Footer";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {auth} from "../actions";
import ReactInterval from 'react-interval';

class Home extends Component {
	state = {
		timer: 0,
		icon: 'fas fa-desktop fa-10x'
	}

	changeIcon(){
		const icons = ['fas fa-tablet-alt','fas fa-mobile-alt','fas fa-desktop']
		let index = this.state.timer % icons.length
		this.setState({icon: icons[index] + ' fa-10x'})
		this.setState({timer: this.state.timer + 1})
	}

	render(){
		return(
			<div style={{overflow: "hidden", width: "100%"}}>
				<Header user={this.props.user} logout={this.props.logout} />
				<section className="text-center">
					<h1>Welcome to <span role="img">👋</span>note!</h1>
					<p style={{fontSize: ".75em"}}>(a.k.a. slapnote)</p>
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
						<div className="col-12" style={{paddingBottom: "100px"}}>
								<h1>Why slapnote?<span role="img" alt="shrug">🤷</span></h1>
						</div>
						<div className="col-12 col-md-4">
							<h3>Vim-inspired colorschemes</h3>
							<i className="fas fa-palette fa-10x"></i>
							<p>Are you used to the colors in your terminal? Edit your notes in a variety of colorschemes with basic Markdown syntax highlighting.</p>
						</div>
						<div className="col-12 col-md-4">
							<h3>Live markdown editor</h3>
							<i className="fab fa-markdown fa-10x"></i>
							<p>Edit your notes in Markdown, the standard markup language used across the web. Supports original, vanilla, and Github flavors.</p>
						</div>
						<div className="col-12 col-md-4">
							<h3>Fully responsive layout</h3>
							<div className="row">
						        <ReactInterval timeout={1000} enabled={true}
			    					callback={() => this.changeIcon()} />
								<div className="col-12" key={Math.random()}>
									<i className={this.state.icon}></i>
								</div>
							</div>
							<p className="last-p">Designed with a mobile-first philosophy, slapnote can be used on a variety of devices and platforms.</p>
						</div>
					</div>
				</section>
				<section className="ss-style-doublediagonal-rev">
					<div className="row first-row-after-rev">
						<div className="col-12 col-md-3">
							<h4>FOSS - Free and Open-Source</h4>
							<p>Review (almost) every line of code, contribute, or suggest improvements on Github! Better yet, fork the project and create your own clone!</p>
						</div>
						<div className="col-12 col-md-3">
							<h4>Simplicity first</h4>
							<p>There's nothing to set up - just create an account and go!</p>
						</div>
						<div className="col-12 col-md-3">
							<h4>Secure & Reliable</h4>
							<p>Slapnote uses token-based authentication and encrypts all traffic, ensuring that your notes stay safe. We will also never use your personal 
								information for anything other than site operations.</p>
						</div>
						<div className="col-12 col-md-3">
							<h4>Professional yet FUN<span role="img">🎉</span></h4>
							<p>Slapnote adds a sense of humor and adventure to a reliabile, secure, and efficient app - who else would have an emoji domain?</p>
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
