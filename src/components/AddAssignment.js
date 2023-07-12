import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// AddAssignment class used to show a Dialog modal which the user uses to add a new assignment to
// the database by entering an assignment name, due date, and course ID.
class AddAssignment extends Component {
	constructor(props) {
    super(props);
		this.state = {open: false, assignment: { }, errors: { } };
    };
  
		// Open the Dialog.
		handleClickOpen = () => {
			this.setState( {open:true} );
		};
		
		// CLose the Dialog.
		handleClose = () => {
			this.setState( {open:false} );
		};

		// Used for settings the assignment name and course ID.
		handleChange = (event) => {
			const name = event.target.name;
			const value = event.target.value;
			this.setState({assignment: {...this.state.assignment, [name]: value}})
			this.setState({errors: {...this.state.errors, [name]: null}}) // clears any previous form validation errors.
		};

		// Used for handling the date object returned by the DatePicker component. 
		handleDueDate = (date) => {
			if (date && date.isValid()) {
				const value = date.$d.toISOString().slice(0,10); // Slices the ISO Date String dropping the time so only YYYY-MM-DD remain.
				console.log("date is valid: " + value);
				this.setState({assignment: {...this.state.assignment, dueDate: value}});
				this.setState({errors: {...this.state.errors, dueDate:null}})
			} else {
				this.setState({errors: {...this.state.errors, dueDate:"Invalid due date"}})
			};
		};

		// Validate form and then save assignment and close Dialog modal form.
		handleAdd = () => {
			if (this.validateForm()) {
				console.log("Submitting new assignment:");
				console.log(this.state.assignment);
				this.props.addAssignment(this.state.assignment);
				this.setState({assignment: {}}); // Resets assignment state
				this.handleClose();
			} else {
				console.log("Form is invalid");
				console.log(this.state.assignment);
			}	
		};

		// Validates the assignment form and sets error descriptions for any invalid inputs.
		validateForm = () => {
			console.log("Validating form");
			let isValid = true;
			let errors = this.state.errors;
			if (!this.state.assignment.assignmentName) { // Assignment name not empty.
				console.log("Missing assignment name");
				errors.assignmentName = "Missing assignment name";
				isValid = false;
			}
			if (!this.state.assignment.courseId) { // Course ID not empty.
				console.log("Missing course ID");
				errors.courseId = "Missing course ID";
				isValid = false;
			}
			if (this.state.errors.dueDate) { // Due date in valid format.
				console.log("Invalid due date");
				isValid = false;
			}
			if (!this.state.assignment.dueDate) { // Due date not empty.
				console.log("Missing due date");
				errors.dueDate = "Missing due date";
				isValid = false;
			}
			this.setState({errors: errors});
			return isValid;
			};
	
	render() {
		return (
			<div>
				<Button variant="contained" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
					Add assignment
				</Button>
				<Dialog open={this.state.open} onClose={this.handleClose}>
					<DialogTitle>Add assignment</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Enter the assignment name, due date, and the course it is for.
						</DialogContentText>
							<TextField required margin="dense" name="assignmentName" label="Assignment Name" fullWidth variant="standard" onChange={this.handleChange} 
								error={!this.state.assignment.assignmentName && this.state.errors.assignmentName} helperText={this.state.errors.assignmentName}/>
							<TextField required type="number" margin="dense" name="courseId" label="Course ID" fullWidth variant="standard" onChange={this.handleChange}
								error={!this.state.assignment.courseId && this.state.errors.courseId} helperText={this.state.errors.courseId}/>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker inputFormat="YYYY-MM-DD" views={['year','month','day']} label={"Due Date" || this.state.assignment.dueDate } value={this.state.assignment.dueDate || null} onChange={this.handleDueDate} 
									renderInput={(params) => <TextField {...params} required margin="dense"
									error={this.state.errors.dueDate } helperText={this.state.errors.dueDate}/>} />
							</LocalizationProvider>
					</DialogContent>
					<DialogActions>
					  <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
					  <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
  };
};
  
// required property: addAssignment is a function to call to perform the Add assignment action.
AddAssignment.propTypes = {
  addAssignment : PropTypes.func.isRequired
};

export default AddAssignment;