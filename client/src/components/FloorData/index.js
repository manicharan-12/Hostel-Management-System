import { Component } from "react";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import "./index.css";
import FloorDetails from "../FloorDetails";
import failure from "../Images/failure-image.png";
import noData from "../Images/no data.png";
import axios from "axios";
import Popup from "reactjs-popup";

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

  addFloor = async () => {
    const { hostelType, floorNo } = this.state;
    if (!floorNo) {
      this.setState({
        errorStatus: true,
        errorMsg: "Floor number cannot be empty",
      });
      return;
    }
    //this.setState({ apiStatus: apiStatusConstants.inProgress });
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
      this.setState({ errorStatus: true, errorMsg: data.error_msg });
    } else {
      await this.setState({
        apiStatus: apiStatusConstants.success,
        errorStatus: false,
        errorMsg: "",
      });
      this.getFloorDetails();
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

  renderFloorNo = (event) => {
    this.setState({ floorNo: event.target.value });
  };

  renderSuccessView = () => {
    const { floorDetails, errorMsg, errorStatus } = this.state;
    const length = floorDetails.length;
    return (
      <div className="floor-detail-container">
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
                  <th>Available</th>
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
            <div className="button-container-floor">
              <Popup
                trigger={
                  <button className="add-floor-button button">Add Floor</button>
                }
                modal
                nested
              >
                {(close) => (
                  <div className="modal">
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                    <div className="form-container-modal">
                      <form>
                        <label htmlFor="floor-no" className="floor-no-label">
                          Enter Floor No:
                        </label>
                        <input
                          type="text"
                          id="floor-no"
                          onChange={this.renderFloorNo}
                        />
                      </form>
                    </div>

                    <div className="actions">
                      <button
                        className="button add-floor-submit-button"
                        type="submit"
                        onClick={async () => {
                          await this.addFloor();
                          if (!errorStatus) {
                            close();
                          } else {
                            this.setState({
                              errorStatus: true,
                              errorMsg: errorMsg,
                            });
                          }
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </div>
        ) : (
          <div>
            <div className="no-data-container">
              <img src={noData} alt="noData" className="no-data-image" />
            </div>
            <div className="button-container-floor">
              <Popup
                trigger={
                  <button className="add-floor-button button">Add Floor</button>
                }
                modal
                nested
              >
                {(close) => (
                  <div className="modal">
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                    <div className="form-container-modal">
                      <form>
                        <label htmlFor="floor-no" className="floor-no-label">
                          Enter Floor No:
                        </label>
                        <input
                          type="text"
                          id="floor-no"
                          onChange={this.renderFloorNo}
                        />
                      </form>
                    </div>

                    <div className="actions">
                      <button
                        className="button add-floor-submit-button"
                        type="submit"
                        onClick={async () => {
                          await this.addFloor();
                          if (!errorStatus) {
                            close();
                          } else {
                            this.setState({
                              errorStatus: true,
                              errorMsg: errorMsg,
                            });
                          }
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </div>
        )}
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

  render() {
    const { errorStatus, errorMsg } = this.state;
    return (
      <div>
        <Header />
        <div>{this.renderFloorData()}</div>
        {errorStatus ? (
          <div>
            <p className="error-msg-add-floor">{errorMsg}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Floor;
