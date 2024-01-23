import { Component } from "react";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import "./index.css";

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

  renderLoadingView = () => {
    return (
      <div className="loader-container">
        <div className="puff-wrapper">
          <Puff color="#ffffff" height="80" width="80" className="my-puff" />
        </div>
      </div>
    );
  };

  renderFloorData = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        break;
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      case apiStatusConstants.failure:
        break;
      default:
        return null;
    }
  };

  render() {
    const { floorDetails } = this.state;
    console.log(floorDetails);
    return (
      <div>
        <Header />
        <div>{this.renderFloorData()}</div>
      </div>
    );
  }
}

export default Floor;
