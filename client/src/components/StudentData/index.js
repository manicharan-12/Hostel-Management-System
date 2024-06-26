import { Component } from "react";
import Header from "../Header";
import { withRouter } from "react-router-dom";
import Back from "../Back";
import { Puff } from "react-loader-spinner";
import failure from "../Images/failure-image.png";
import "./index.css";
import StudentDetails from "../StudentDetails";
import axios from "axios";
import noData from "../Images/no data.png";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class StudentData extends Component {
  state = {
    hostelType: "",
    apiStatus: apiStatusConstants.initial,
    studentData: [],
    name: "",
  };

  componentDidMount() {
    const { hostelType } = this.props.match.params;
    this.setState({ hostelType: hostelType }, () => {
      this.getStudentData();
    });
  }

  getStudentData = async () => {
    try {
      this.setState({ apiStatus: apiStatusConstants.inProgress });
      const { hostelType } = this.state;
      const api = `http://localhost:8000/student-data/${hostelType}`;
      const response = await fetch(api);
      const data = await response.json();
      if (response.status !== 200) {
        this.setState({ apiStatus: apiStatusConstants.failure });
      } else {
        this.setState({
          apiStatus: apiStatusConstants.success,
          studentData: data.student_data,
        });
      }
    } catch (error) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  onClickDeleteStudent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/student-data/delete/student/${id}`,
      );
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

  onClickUpdateStudentData = async (updatedData, id) => {
    const { hostelType } = this.state;
    await axios.put(
      `http://localhost:8000/update/student/data/${hostelType}`,
      updatedData,
    );

    this.getStudentData();
  };

  renderName = (event) => {
    this.setState({ name: event.target.value });
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
    const { studentData, name } = this.state;
    const length = studentData.length;
    let newStudentData;
    const role = Cookies.get("role");

    newStudentData = studentData.filter((eachStudent) => {
      if (
        eachStudent.student_name.toUpperCase().includes(name.toUpperCase()) ===
        true
      ) {
        return eachStudent.student_name
          .toUpperCase()
          .includes(name.toUpperCase());
      } else if (
        eachStudent.hall_ticket_number
          .toUpperCase()
          .includes(name.toUpperCase()) === true
      ) {
        return eachStudent.hall_ticket_number
          .toUpperCase()
          .includes(name.toUpperCase());
      } else {
        return eachStudent.student_name
          .toUpperCase()
          .includes(name.toUpperCase());
      }
    });
    return (
      <>
        {length > 0 ? (
          <>
            <div className="header-student">
              <h1>Student Detail</h1>
              <div className="student-search-container">
                <h3 style={{ marginRight: "12px" }}>Search By</h3>
                <input
                  type="text"
                  className="search-student"
                  placeholder="Name or Hall Ticket Number"
                  onChange={this.renderName}
                />
              </div>
            </div>
            <ul className="responsive-table-student">
              <li className="table-header-student">
                <div className="col col-student">
                  <p>Name</p>
                </div>
                <div className="col col-student">
                  <p>Hall Ticket</p> <p>Number</p>
                </div>
                <div className="col col-student">
                  <p>Branch</p>
                </div>
                <div className="col col-student">
                  <p>Year</p>
                </div>
                <div className="col col-student">
                  <p>Mobile Number</p>
                </div>
                <div className="col col-student">
                  <p>Room No</p>
                </div>
                <div className="col col-student"></div>
                <div className="col col-student"></div>
              </li>
              {newStudentData.map((eachStudent) => (
                <StudentDetails
                  key={eachStudent.id}
                  details={eachStudent}
                  onClickDeleteStudent={this.onClickDeleteStudent}
                  onClickUpdateStudentData={this.onClickUpdateStudentData}
                />
              ))}
            </ul>
          </>
        ) : (
          <div className="no-data-container">
            <img src={noData} alt="noData" className="no-data-image" />
            {role === "super admin" ? (
              <h2>No Data Available. Please do Register a Student</h2>
            ) : (
              <h2>No Data Available</h2>
            )}
          </div>
        )}
      </>
    );
  };

  renderStudentData = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div>
        <Header />
        <Back />
        <>{this.renderStudentData()}</>
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

export default withRouter(StudentData);
