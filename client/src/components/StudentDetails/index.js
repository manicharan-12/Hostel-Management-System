import { Component } from "react";
import { FiEdit } from "react-icons/fi";
import "./index.css";
import { IoCloseSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

class StudentDetails extends Component {
  constructor(props) {
    super(props);
    const { details } = this.props;
    const {
      student_name,
      hall_ticket_number,
      branch,
      current_year,
      mobile_number,
      room_no,
    } = details;
    this.state = {
      name: student_name,
      hall_ticket_number,
      branch,
      current_year,
      mobile_number,
      room_no,
    };
  }

  state = { isEditClicked: false };

  editStudent = () => {
    this.setState({ isEditClicked: true });
  };

  cancelEdit = () => {
    const { onClickUpdateStudentData, details } = this.props;
    const { id } = details;
    const {
      name,
      hall_ticket_number,
      branch,
      current_year,
      mobile_number,
      room_no,
    } = this.state;
    this.setState({ isEditClicked: false });
    const updatedData = {
      name,
      hall_ticket_number,
      branch,
      current_year,
      mobile_number,
      room_no,
      id,
    };
    onClickUpdateStudentData(updatedData);
  };

  onChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  onChangeHallTicketNumber = (event) => {
    this.setState({ hall_ticket_number: event.target.value });
  };

  onChangeBranch = (event) => {
    this.setState({ branch: event.target.value });
  };

  onChangeCurrentYear = (event) => {
    this.setState({ current_year: event.target.value });
  };

  onChangeMobileNumber = (event) => {
    this.setState({ mobile_number: event.target.value });
  };

  render() {
    const {
      isEditClicked,
      name,
      hall_ticket_number,
      branch,
      current_year,
      mobile_number,
      room_no,
    } = this.state;
    const { onClickDeleteStudent, details } = this.props;
    const { id } = details;

    return (
      <>
        <li className="table-row-student">
          <div className="col col-student" data-label="Name">
            {isEditClicked === true ? (
              <div className="edit-student-container">
                <input
                  type="text"
                  value={name}
                  onChange={this.onChangeName}
                  className="edit-student-input"
                />
              </div>
            ) : (
              <p>{name}</p>
            )}
          </div>
          <div className="col col-student" data-label="Hall Ticket Number">
            {isEditClicked === true ? (
              <div className="edit-student-container">
                <input
                  type="text"
                  value={hall_ticket_number}
                  className="edit-student-input"
                  onChange={this.onChangeHallTicketNumber}
                />
              </div>
            ) : (
              <p>{hall_ticket_number}</p>
            )}
          </div>
          <div className="col col-student" data-label="Branch">
            {isEditClicked === true ? (
              <div className="edit-student-container">
                <input
                  type="text"
                  value={branch}
                  className="edit-student-input"
                  onChange={this.onChangeBranch}
                />
              </div>
            ) : (
              <p>{branch}</p>
            )}
          </div>
          <div className="col col-student" data-label="Year">
            {isEditClicked === true ? (
              <div className="edit-student-container">
                <input
                  type="text"
                  value={current_year}
                  className="edit-student-input"
                  onChange={this.onChangeCurrentYear}
                />
              </div>
            ) : (
              <p>{current_year}</p>
            )}
          </div>
          <div className="col col-student" data-label="Mobile Number">
            {isEditClicked === true ? (
              <div className="edit-student-container">
                <input
                  type="text"
                  value={mobile_number}
                  className="edit-student-input"
                  onChange={this.onChangeMobileNumber}
                />
              </div>
            ) : (
              <p>{mobile_number}</p>
            )}
          </div>
          <div className="col col-student" data-label="Room No">
            <p>{room_no}</p>
          </div>
          <div className="col col-student">
            {isEditClicked === true ? (
              <>
                <IoCloseSharp
                  style={{ cursor: "pointer" }}
                  onClick={this.cancelEdit}
                />
              </>
            ) : (
              <FiEdit
                onClick={this.editStudent}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
          <div className="col col-student">
            <MdDelete
              className="delete-icon"
              onClick={() => onClickDeleteStudent(id)}
            />
          </div>
        </li>
      </>
    );
  }
}

export default StudentDetails;
