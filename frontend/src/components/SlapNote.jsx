import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {notes, auth} from "../actions";
import ReactMde, {ReactMdeTypes, DraftUtil} from "react-mde";
import * as Showdown from "showdown";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import MediaQuery from 'react-responsive';

export interface AppState {
	    mdeState: ReactMdeTypes.MdeState;
}

class SlapNote extends Component<{}, AppState> {

    converter: Showdown.Converter;

	constructor(props) {
		super(props);
		    this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true});
	}

	state = {
		name: "",
		text: "",
		updateNoteId: null,
		mdeState: null,
		lightscheme: false,
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
			this.props.addNote(this.state.mdeState.markdown, this.state.name).then(this.resetForm)
		} else {
			this.props.updateNote(this.state.updateNoteId, this.state.mdeState.markdown, this.state.name).then(this.resetForm);
		}
		this.resetForm();
	}

	selectForDelete = (id) => {
		confirmAlert({
			message: 'Do you really want to delete this note? This action cannot be undone.',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {this.props.deleteNote(id), this.resetForm()}
				},
				{
					label: 'No',
				}
			]
		})
	};

    handleValueChange = (mdeState: ReactMdeTypes.MdeState) => {
		this.setState({mdeState});
	}

	componentDidMount() {
	    this.props.fetchNotes();
	}

	render() {
		return (
			<div className="container-fluid">
			    <div style={{float: "right"}}>
			    	{this.props.user.username} (<a href="#!" onClick={this.props.logout}>logout</a>)
			    </div>
				<h2><span role="img">👋</span>note!</h2>
				<hr/>
				<div className="row">
					<div className="col-md-2">
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
					<div className="col-md-10">
						<form onSubmit={this.submitNote}>
							<fieldset>
								<div className="form-group">
								<input
									className="form-control"
									value={this.state.name}
									placeholder="Enter name here..."
									onChange={(e) => this.setState({name: e.target.value})}
								required />
								</div>
								<div className="form-group">
									<MediaQuery query="(min-device-width: 576px)">
										<ReactMde
											className={this.state.lightscheme ? "lightscheme" : "darkscheme"}
											onChange={this.handleValueChange}
											editorState={this.state.mdeState}
											generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
											layout="horizontal"
										/>
									</MediaQuery>
									<MediaQuery query="(max-device-width: 576px)">
										<ReactMde
											className={this.state.lightscheme ? "lightscheme" : "darkscheme"}
											onChange={this.handleValueChange}
											editorState={this.state.mdeState}
											generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
										/>
									</MediaQuery>
								</div>
								<div className="d-inline-flex">
									<div className="form-group justify-content-start p-2">
										<button type="button submit" className="btn btn-primary" value="Save Note">Save Note</button>
									</div>
									<div className="form-group justify-content-start p-2">
										<button onClick={this.resetForm} type="button" className="btn btn-default">Reset</button>
										</div>
									<div className="form-group justify-content-start p-2">
										<button onClick={()=>this.setState({lightscheme: !this.state.lightscheme})} type="button" className="btn btn-default">Change to {this.state.lightscheme ? "dark" : "light"} colorscheme</button>
									</div>

								</div>
							</fieldset>
						</form>
					</div>
				</div>
				<p>
					<Link to="/contact">Click Here</Link> to contact us!
				</p>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		notes: state.notes,
		user: state.auth.user,
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
		logout: () => dispatch(auth.logout()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SlapNote);
