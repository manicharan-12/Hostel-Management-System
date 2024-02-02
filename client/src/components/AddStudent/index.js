import { Component } from "react";
import Header from "../Header";
import Back from "../Back";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class AddStudent extends Component {
  state = {
    name: "",
    hallTicket_number: "",
    branch: "",
    current_year: "",
    room_no: "",
    gender: "",
    mobile_number: "",
    error_msg: "",
    hostelType: this.props.match.params.hostelType,
  };

  addStudentData = async (event) => {
    event.preventDefault();
    const {
      name,
      hallTicket_number,
      branch,
      current_year,
      room_no,
      gender,
      mobile_number,
      hostelType,
    } = this.state;
    if (
      name === "" ||
      hallTicket_number === "" ||
      branch === "" ||
      current_year === "" ||
      room_no === null ||
      gender === "" ||
      mobile_number === ""
    ) {
      this.setState({ error_msg: "All Fields Need to be Filled" });
    } else {
      this.setState({ error_msg: "" });
      const api = `http://localhost:8000/student-data/add/student/${hostelType}`;
      const postStudent = {
        name,
        hallTicket_number,
        branch,
        current_year,
        room_no,
        gender,
        mobile_number,
      };
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postStudent),
      };
      const response = await fetch(api, option);
      if (response.status !== 200) {
        const data = await response.json();
        this.setState({ error_msg: data.error_msg });
      } else {
        this.setState({
          name: "",
          hallTicket_number: "",
          branch: "",
          current_year: "",
          room_no: "",
          gender: "",
          mobile_number: "",
          error_msg: "",
        });
        toast.success("Student Added Successfully", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  renderName = (event) => {
    this.setState({ name: event.target.value });
  };

  renderHallTicketNumber = (event) => {
    this.setState({ hallTicket_number: event.target.value });
  };

  renderBranch = (event) => {
    this.setState({ branch: event.target.value });
  };

  renderYear = (event) => {
    this.setState({ current_year: event.target.value });
  };

  renderRoomNo = (event) => {
    this.setState({ room_no: event.target.value });
  };

  renderGender = (event) => {
    this.setState({ gender: event.target.value });
  };

  renderMobileNumber = (event) => {
    this.setState({ mobile_number: event.target.value });
  };

  renderForm = () => {
    const {
      error_msg,
      name,
      hallTicket_number,
      branch,
      current_year,
      room_no,
      mobile_number,
    } = this.state;
    return (
      <div className="add-student-main-container">
        <div className="add-student-container">
          <h1>Fill out the Student Detail Below</h1>
          <form className="add-student-form" onSubmit={this.addStudentData}>
            <div className="add-student-input-container">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                className="add-input-student"
                id="name"
                onChange={this.renderName}
                value={name}
              />
            </div>
            <div className="add-student-input-container">
              <label htmlFor="hall-ticket">Hall Ticket Number:</label>
              <input
                type="text"
                className="add-input-student"
                id="hall-ticket"
                onChange={this.renderHallTicketNumber}
                value={hallTicket_number}
              />
            </div>
            <div className="add-student-input-container">
              <label htmlFor="branch">Branch:</label>
              <input
                type="text"
                className="add-input-student"
                id="branch"
                onChange={this.renderBranch}
                value={branch}
              />
            </div>
            <div className="add-student-input-container">
              <label htmlFor="year">Current Year:</label>
              <input
                type="text"
                className="add-input-student"
                id="year"
                onChange={this.renderYear}
                value={current_year}
              />
            </div>
            <div className="add-student-input-container">
              <label htmlFor="room-no">Room No:</label>
              <input
                type="text"
                className="add-input-student"
                id="room-no"
                onChange={this.renderRoomNo}
                value={room_no}
              />
            </div>
            <div className="add-student-input-container">
              <label>Gender:</label>
              <div>
                <input
                  type="radio"
                  className="add-student-radio"
                  name="gender"
                  value="male"
                  id="male"
                  style={{ cursor: "pointer" }}
                  onChange={this.renderGender}
                />
                <label htmlFor="male" style={{ cursor: "pointer" }}>
                  {" "}
                  Male
                </label>
                <input
                  type="radio"
                  className="add-student-radio"
                  name="gender"
                  value="female"
                  id="female"
                  style={{ cursor: "pointer" }}
                  onChange={this.renderGender}
                />
                <label htmlFor="female" style={{ cursor: "pointer" }}>
                  Female
                </label>
              </div>
            </div>
            <div className="add-student-input-container">
              <label>Mobile Number:</label>
              <input
                type="text"
                className="add-input-student"
                onChange={this.renderMobileNumber}
                value={mobile_number}
              />
            </div>
            <div>
              <button type="submit" className="add-student-button">
                Add Student
              </button>
            </div>
            <p style={{ color: "red", marginTop: "8px" }}>{error_msg}</p>
          </form>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Header />
        <Back />
        {this.renderForm()}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </div>
    );
  }
}

export default AddStudent;
