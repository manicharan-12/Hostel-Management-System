import { Component } from "react";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import "./index.css";
import FloorDetails from "../FloorDetails";
import failure from "../Images/failure-image.png";
import noData from "../Images/no data.png";
import axios from "axios";
import Back from "../Back";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const { hostelType } = this.props.match.params;
    this.setState({ hostelType: hostelType }, () => {
      this.getFloorDetails();
    });
  }

  getFloorDetails = async () => {
    try {
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
    } catch (error) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  onClickDeleteFloor = async (id) => {
    const { floorDetails } = this.state;
    try {
      const { hostelType } = this.state;
      await axios.delete(
        `http://localhost:8000/floor-data/delete/${hostelType}/${id}`,
      );
      const updatedList = floorDetails.filter((floor) => floor.id !== id);
      this.setState({ floorDetails: updatedList });
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
    const { floorDetails, errorStatus, errorMsg, show } = this.state;
    const length = floorDetails.length;
    return (
      <>
        {length > 0 ? (
          <div className="floor-data-container">
            <div className="header-floor">
              <h1>Floor Details</h1>
            </div>
            <div className="floor-table">
              <ul className="responsive-table-floor">
                <li className="table-header-floor">
                  <div className="col col-floor">
                    <p>Floor</p> <p>Number</p>
                  </div>
                  <div className="col col-floor">
                    <p>Number</p> <p>of Rooms</p>
                  </div>
                  <div className="col col-floor">
                    <p>Present</p>
                    <p>students</p>
                  </div>
                  <div className="col col-floor">
                    <p>Available</p>
                    <p>Students</p>
                  </div>
                  <div className="col col-floor">
                    <p>Total</p>
                    <p></p>Students
                  </div>
                  <div className="col col-floor-last"></div>
                </li>
                {floorDetails.map((eachFloor) => (
                  <FloorDetails
                    key={eachFloor.id}
                    details={eachFloor}
                    onClickDeleteFloor={this.onClickDeleteFloor}
                  />
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <div className="no-data-container">
              <img src={noData} alt="noData" className="no-data-image" />
              <h2>No Floors Available</h2>
            </div>
          </div>
        )}
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
      </>
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
    try {
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

  render() {
    return (
      <>
        <Header />
        <div className="floor-detail-container">
          <Back />
          {this.renderFloorData()}
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
      </>
    );
  }
}

export default Floor;
