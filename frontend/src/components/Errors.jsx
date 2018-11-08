import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {auth} from "../actions";


export default class Errors extends Component {

	Capitalize(str){
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	Replace(str, text, replacementText){
		return str.replace(text, replacementText)
	}

	render() {

		let errors = (
			<div>
				<div className="alert alert-danger" role="alert">
					<strong>Uh-oh! Looks like there are some errors with your submission</strong>
					{this.props.errors.map(error => { 
						if (error.message[0].match(/This field/g)){
							return(
								<div>
								<hr />
										<span>{this.Capitalize(this.Replace(error.field, "_", " "))}</span><span>{this.Replace(error.message[0],"This field","")}</span>
								</div>
							)
						} else {
							return(
								<div>
								<hr />
										<span>{error.message[0]}</span>
								</div>
							)

						}
					})}
				</div>
			</div>
		)

		return (
			<div>
				{errors}
			</div>
		)
	}
}
