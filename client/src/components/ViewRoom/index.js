import { Component } from "react";
import Back from "../Back";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import failure from "../Images/failure-image.png";
import "./index.css";
import noData from "../Images/no data.png";
import ViewRoomDetails from "../ViewRoomDetails";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class ViewRoom extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    studentData: [],
    roomData: [],
    isButtonClicked: false,
    optionsData: [],
  };

  componentDidMount() {
    this.getStudentData();
  }

  getStudentData = async () => {
    try {
      this.setState({ apiStatus: apiStatusConstants.inProgress });
      const id = this.props.history.location.state.id;
      const api = `http://localhost:8000/room-data/student/${id}`;
      const response = await fetch(api);
      const data = await response.json();
      if (response.status === 200) {
        this.setState({
          studentData: data.studentRoomData,
          roomData: data.getRoomCount,
          optionsData: data.totalStudent,
          apiStatus: apiStatusConstants.success,
        });
      } else {
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    } catch (error) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  addStudent = async (event) => {
    try {
      const roomId = this.props.history.location.state.id;
      const studentId = event.id;
      await axios.put(
        `http://localhost:8000/update/room/student/${roomId}/${studentId}`,
      );
      this.setState({ isButtonClicked: false });
      this.getStudentData();
    } catch (error) {
      toast.error("Something Went Wrong! Please Try again later", {
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
  };

  onDeleteRoomStudent = async (id) => {
    try {
      await axios.put(`http://localhost:8000/edit/room/student/${id}`);
      this.getStudentData();
    } catch (error) {
      toast.error("Something Went Wrong! Please Try again later", {
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
  };

  renderLoadingView = () => {
    return (
      <div className="loader-container">
        <div className="puff-wrapper">
          <Puff color="#ffffff" height="80" width="80" className="my-puff" />
        </div>
      </div>
    );
  };

  renderFailureView = () => {
    return (
      <div className="failure-container">
        <div className="image-container-failure">
          <img src={failure} alt="fail" />
        </div>
      </div>
    );
  };

  renderSuccessView = () => {
    const { studentData, roomData, isButtonClicked, optionsData } = this.state;
    let options = [];
    for (let eachStudent of optionsData) {
      if (eachStudent.room_id === null) {
        options.push({
          value: eachStudent.student_name,
          label: eachStudent.student_name,
          id: eachStudent.id,
        });
      }
    }
    const { available_students } = roomData;
    const length = studentData.length;
    return (
      <>
        {length > 0 ? (
          <>
            <ul className="responsive-table-view-room">
              <li className="table-header-view-room">
                <div className="col col-view-room">
                  <p>Name</p>
                </div>
                <div className="col col-view-room">
                  <p>Hall Ticket</p> <p>Number</p>
                </div>
                <div className="col col-view-room">
                  <p>Branch</p>
                </div>
                <div className="col col-view-room">
                  <p>Year</p>
                </div>
                <div className="col col-view-room">
                  <p>Mobile</p>
                  <p>Number</p>
                </div>
                <div className="col col-view-room"></div>
              </li>
              {studentData.map((eachStudent) => (
                <ViewRoomDetails
                  key={eachStudent.id}
                  details={eachStudent}
                  onDeleteRoomStudent={this.onDeleteRoomStudent}
                />
              ))}
            </ul>
            {available_students !== 0 ? (
              <div className="add-student-button-container">
                <button
                  className="add-student-button"
                  onClick={() => this.setState({ isButtonClicked: true })}
                >
                  Add Student
                </button>
              </div>
            ) : (
              ""
            )}
            {isButtonClicked === true ? (
              <div className="select-container">
                <Select
                  isSearchable={true}
                  options={options}
                  className="basic-single select-bar"
                  classNamePrefix="select"
                  onChange={this.addStudent}
                />
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          <div>
            {isButtonClicked === true ? (
              <div className="select-container">
                <Select
                  isSearchable={true}
                  options={options}
                  className="basic-single select-bar"
                  classNamePrefix="select"
                  onChange={this.addStudent}
                />
              </div>
            ) : (
              <>
                <div className="no-data-container">
                  <img src={noData} alt="noData" className="no-data-image" />
                </div>
                <h2 style={{ textAlign: "center", marginBottom: "12px" }}>
                  No Students are Assigned to this Room
                </h2>
                <div className="add-student-button-container">
                  <button
                    className="add-student-button"
                    onClick={() => this.setState({ isButtonClicked: true })}
                  >
                    Add Student
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </>
    );
  };

  renderRoomStudentData = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      default:
        break;
    }
  };

  render() {
    return (
      <div>
        <Header />
        <Back />
        <div>{this.renderRoomStudentData()}</div>
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

export default ViewRoom;
