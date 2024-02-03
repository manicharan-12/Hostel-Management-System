import { Component } from "react";
import Back from "../Back";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import failure from "../Images/failure-image.png";
import "./index.css";
import noData from "../Images/no data.png";
import ViewRoomDetails from "../ViewRoomDetails";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class ViewRoom extends Component {
  state = { apiStatus: apiStatusConstants.initial, studentData: [] };

  componentDidMount() {
    this.getStudentData();
  }

  getStudentData = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const id = this.props.history.location.state.id;
    const api = `http://localhost:8000/room-data/student/${id}`;
    const response = await fetch(api);
    const data = await response.json();
    if (response.status === 200) {
      this.setState({
        studentData: data.studentRoomData,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
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
    const { studentData } = this.state;
    const length = studentData.length;
    return (
      <>
        {length > 0 ? (
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
            </li>
            {studentData.map((eachStudent) => (
              <ViewRoomDetails key={eachStudent.id} details={eachStudent} />
            ))}
          </ul>
        ) : (
          <div>
            <div className="no-data-container">
              <img src={noData} alt="noData" className="no-data-image" />
            </div>
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
      </div>
    );
  }
}

export default ViewRoom;
