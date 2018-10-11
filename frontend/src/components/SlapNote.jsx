import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {notes, auth, profile} from "../actions";
import ReactMde, {ReactMdeTypes, DraftUtil} from "react-mde";
import * as Showdown from "showdown";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import MediaQuery from 'react-responsive';
import xssFilter from 'showdown-xss-filter';
import Header from "./Header";
import Footer from "./Footer";
import { CSSTransitionGroup } from 'react-transition-group';

export interface AppState {
	    mdeState: ReactMdeTypes.MdeState;
}

class SlapNote extends Component<{}, AppState> {

    converter: Showdown.Converter;

	constructor(props) {
		super(props);
		    this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true, 
				strikethrough: true, tasklists: true, simpleLineBreaks: true, emoji: true,
				underline: true, extensions: []});
	}

	state = {
		name: "",
		text: "",
		updateNoteId: null,
		mdeState: null,
		colorscheme: "molokai",
		flavor: "vanilla",
		showSettings: false,
		layout: null,
		height: null,
		width: null,
		submitStatus: null,
		alertVisible: true,
	}

	resetForm = () => {
		this.setState({mdeState: null, updateNoteId: null, name: ""});
	}

	selectForEdit = (id) => {
		let note = this.props.notes[id];
		this.setState({updateNoteId: id, name: note.name});
		let { mdeState } = this.state;
		let newDraftState= DraftUtil.buildNewDraftState(
			mdeState.draftEditorState,
			{
				selection: {
					start: 0,
					end: 0
				},
			text: note.text
			}
		);
		this.setState({
			mdeState: {
				markdown: note.text,
			    html: this.generateMarkdownPreview,
			    draftEditorState: newDraftState
			}
		});
	}

	submitNote = (e) => {
		e.preventDefault();
		if (this.state.updateNoteId === null) {
			this.props.addNote(this.state.mdeState.markdown, this.state.name).then(
				(data)=>{this.setState({submitStatus: data})},
				(error)=>{this.setState({error})}
			)
		} else {
			this.props.updateNote(this.state.updateNoteId, this.state.mdeState.markdown, this.state.name).then(
				(data)=>{this.setState({submitStatus: data})},
				(error)=>{this.setState({error})}
			)
		}
		this.setState({alertVisible: true});
	}

	selectForDelete = (id) => {
		confirmAlert({
			message: 'Do you really want to delete this note? This action cannot be undone.',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {(this.props.deleteNote(id), this.resetForm())}
				},
				{
					label: 'No',
				}
			]
		})
	};

	setFlavor = (flavor) => {
		this.converter.setFlavor(flavor)
		this.setState({flavor: flavor})
	}

	saveProfile = () => {
		this.props.updateProfile(this.state.colorscheme, this.state.layout, this.state.flavor)
	}

    handleValueChange = (mdeState: ReactMdeTypes.MdeState) => {
		this.setState({mdeState});
	}

	onResize = (event, {element, size}) => {
		this.setState({width: size.width, height: size.height});
	};

	componentDidMount() {
		if (!this.props.notes.length){
	    	this.props.fetchNotes();
		}
		this.props.fetchProfile();
	}

	render() {
		if (this.props.profile.isLoading){
			return <em>Loading...</em>;
		} else {
			let alert;
			if (this.props.errors.length) {
				alert = (this.props.errors.map(error => (
					<div className="alert alert-danger" role="alert" key={error.field}>{error.message}</div>
				)))
			} else if (this.state.submitStatus && this.state.alertVisible) {
				alert = (
					<div className="alert alert-success alert-dismissible fade show" role="alert">
						{this.state.submitStatus.note.name} has been {this.state.submitStatus.type === "ADD_NOTE" ? "added" : "updated"} successfully!
						<button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={(e)=>this.setState({alertVisible: false})}>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
				)
			}	
			
			return (
				<div>
					<Header user={this.props.user} logout={this.props.logout} />
					<div className="container-fluid">
						<div className="row">
							<div className="col-md-1">
								<h3>Notes</h3>
								<table>
									<tbody>
										{this.props.notes.map((note, id) => (
											<tr key={`note_${id}`}>
												<td><a href="#!" onClick={() => this.selectForDelete(id)}><span role="img">🗑️</span></a></td>
												<td><a href="#!" onClick={() => this.selectForEdit(id)}>{note.name}</a></td>
											</tr>
										))}
									</tbody>
								</table>
							<hr className="d-block d-sm-none"/>
							</div>
							<div className="col-md-11">
								<form onSubmit={this.submitNote}>
									<fieldset>
										<div className="row">
											<div className="form-group col-11">
											<input
												className="form-control"
												value={this.state.name}
												placeholder="Enter name here..."
												onChange={(e) => this.setState({name: e.target.value})}
											required />
											</div>
											<div className="col-1">
												<h3>
													<a href="#!">
														<span role="img" 
														onClick={(e)=>(this.setState({showSettings: !this.state.showSettings}))}  
														data-toggle="tooltip" 
														data-placement="top" 
														title="Settings">
															⚙️
														</span>
													</a>
												</h3>
											</div>
										</div>
										<CSSTransitionGroup
											transitionName="settings-transition"
											transitionEnterTimeout={500}
											transitionLeaveTimeout={500}
										>
										{ this.state.showSettings ?
										<div className="row">
											<div className="form-group col-2 justify-content-start">
												<label labelFor="colorscheme">Color Scheme</label>
												<select 
												className="form-control"
												id="colorscheme" 
												name="colorscheme"
												onChange={(e)=>this.setState({colorscheme: e.target.value})}
												>
													<option value="molokai">Molokai Dark</option>
													<option value="solarized">Solarized Light</option>
												</select>
											</div>
											<div className="form-group col-2 justify-content-start">
												<label labelFor="flavor">Markdown Flavor</label>
												<select 
												className="form-control"
												id="flavor" 
												name="flavor"
												onChange={(e)=>this.setFlavor(e.target.value)}
												>
													<option value="original">Original</option>
													<option value="vanilla">Vanilla</option>
													<option value="github">Github</option>
												</select>
											</div>
											<div className="form-group col-2 justify-content-start">
												<label labelFor="layout">Layout</label>
												<select 
												className="form-control"
												id="layout" 
												name="layout"
												onChange={(e)=>this.setState({layout:e.target.value})}
												>
													<option value="vertical">Vertical</option>
													<option value="horizontal">Horizontal</option>
													<option value="tabbed">Tabbed</option>
												</select>
											</div>
											<button className="btn btn-default" onClick={(e)=>(e.preventDefault(),this.saveProfile())}>Save settings</button>
										</div>
										: null }
										</CSSTransitionGroup>
										<div className="form-group">
											<MediaQuery query="(min-device-width: 576px)">
												<ReactMde
													className={this.props.profile.profile.colorscheme}
													onChange={this.handleValueChange}
													editorState={this.state.mdeState}
													generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
													layout={this.props.profile.layout ? this.props.profile.layout : "horizontal"}
												/>
											</MediaQuery>
											<MediaQuery query="(max-device-width: 576px)">
												<ReactMde
													className={this.props.profile.profile.colorscheme}
													onChange={this.handleValueChange}
													editorState={this.state.mdeState}
													generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
													layout={this.props.profile.layout ? this.props.profile.layout : "vertical"}
												/>
											</MediaQuery>
										</div>
										{alert}
										<div className="d-inline-flex">
											<div className="form-group justify-content-start p-2">
												<button type="button submit" className="btn btn-primary" value="Save Note">Save Note</button>
											</div>
											<div className="form-group justify-content-start p-2">
												<button onClick={this.resetForm} type="button" className="btn btn-default">New Note</button>
											</div>
										</div>
									</fieldset>
								</form>
							</div>
						</div>
					</div>
					<Footer style={{position: "fixed"}}/>
				</div>
			)
		}
	}
}

const mapStateToProps = state => {
	let errors = [];
	if (state.notes.errors) {
		errors = Object.keys(state.notes.errors).map(field => {
			return {field, message: state.notes.errors[field]};
		});
	}
	return {
		notes: state.notes,
		user: state.auth.user,
		profile: state.profile,
		errors
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchNotes: () => {
			dispatch(notes.fetchNotes());
	    },
		addNote: (text, name) => {
			return dispatch(notes.addNote(text, name));
		},
		updateNote: (id, text, name) => {
		    return dispatch(notes.updateNote(id, text, name));
		},
		deleteNote: (id) => {
		    dispatch(notes.deleteNote(id));
		},
		fetchProfile: () => {
			dispatch(profile.fetchProfile());
		},
		updateProfile: (colorscheme, layout, flavor) => {
			dispatch(profile.updateProfile(colorscheme, layout, flavor));
		},
		logout: () => dispatch(auth.logout()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SlapNote);
