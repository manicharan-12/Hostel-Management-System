import { Component } from "react";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import "./index.css";
import FloorDetails from "../FloorDetails";
import failure from "../Images/failure-image.png";
import noData from "../Images/no data.png";
import axios from "axios";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class Floor extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    hostelType: "",
    floorDetails: [],
    floorNo: null,
    errorStatus: false,
    errorMsg: "",
    show: false,
  };

  componentDidMount() {
    const { hostel_type } = this.props.location.state;
    this.setState({ hostelType: hostel_type }, () => {
      this.getFloorDetails();
    });
  }

  getFloorDetails = async () => {
    const { hostelType } = this.state;
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const api = `http://localhost:8000/floor-data/${hostelType}`;
    const response = await fetch(api);
    const data = await response.json();
    const floorDetails = data.floorDetails;
    if (response.status !== 200) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    } else {
      this.setState({
        floorDetails: floorDetails,
        apiStatus: apiStatusConstants.success,
      });
    }
  };

  onClickDeleteFloor = async (id) => {
    const { hostelType } = this.state;
    await axios.delete(
      `http://localhost:8000/floor-data/delete/${hostelType}/${id}`,
    );
    this.getFloorDetails();
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

  renderSuccessView = () => {
    const { floorDetails } = this.state;
    const length = floorDetails.length;
    return (
      <>
        {length > 0 ? (
          <div className="floor-data-container">
            <div className="header-floor">
              <h1>Floor Details</h1>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Floor Number</th>
                  <th>Number of Rooms</th>
                  <th>Present students</th>
                  <th>Available Students</th>
                  <th>Total Students</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {floorDetails.map((eachFloor) => (
                  <FloorDetails
                    key={eachFloor.id}
                    details={eachFloor}
                    onClickDeleteFloor={this.onClickDeleteFloor}
                  />
                ))}
              </tbody>
            </table>
          </div>
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

  renderFailureView = () => {
    return (
      <div className="failure-container">
        <div className="image-container-failure">
          <img src={failure} alt="fail" />
        </div>
      </div>
    );
  };

  renderFloorData = () => {
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

  addFloor = async (event) => {
    event.preventDefault();
    const { hostelType, floorNo } = this.state;
    if (!floorNo) {
      this.setState({
        errorStatus: true,
        errorMsg: "Floor number cannot be empty",
      });
      return;
    }
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const api = `http://localhost:8000/floor-data/add/floor/${hostelType}`;
    const postFloor = { floorNo };
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postFloor),
    };
    const response = await fetch(api, option);

    console.log(response);
    if (response.ok !== true) {
      const data = await response.json();
      this.setState({
        errorStatus: true,
        errorMsg: data.error_msg,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      await this.setState({
        apiStatus: apiStatusConstants.success,
        errorStatus: false,
        errorMsg: "",
        show: false,
      });
      this.getFloorDetails();
    }
  };

  render() {
    const { errorStatus, errorMsg, show, floorNo } = this.state;
    console.log(floorNo);
    return (
      <>
        <Header />
        <div className="floor-detail-container">
          {this.renderFloorData()}
          <div className="button-container-floor">
            <button
              className="add-floor-button button"
              onClick={() => {
                this.setState({ show: true });
              }}
            >
              Add Floor
            </button>
          </div>
          {show ? (
            <div className="form-container-floor">
              <div className="form-container-">
                <div className="close-button-container-floor">
                  <button
                    className="close-button-floor"
                    onClick={() => {
                      this.setState({
                        show: false,
                        errorStatus: false,
                        errorMsg: "",
                      });
                    }}
                  >
                    &times;
                  </button>
                </div>
                <form className="form-floor" onSubmit={this.addFloor}>
                  <div className="input-container-floor">
                    <label htmlFor="floor-no" className="floor-no-label">
                      Enter Floor No:
                    </label>
                    <input
                      className="input-floor"
                      type="text"
                      id="floor-no"
                      onChange={(event) => {
                        this.setState({ floorNo: event.target.value });
                      }}
                    />
                  </div>
                  <button type="submit" className="submit-button-floor">
                    Submit
                  </button>
                </form>
                {errorStatus ? (
                  <div className="error-msg-container-floor">
                    <p className="error-msg-add-floor">{errorMsg}</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

export default Floor;
