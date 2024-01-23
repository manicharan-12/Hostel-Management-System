import { Link, withRouter } from "react-router-dom";
import Header from "../Header";
import boy from "../Images/hostel boy.png";
import girl from "../Images/hostel girl.png";
import "./index.css";
import { Component } from "react";
import HostelType from "../../context/hostelType";

class Home extends Component {
  static contextType = HostelType;

  setBoys = () => {
    this.context.setHostelType("boys");
  };

  setGirls = () => {
    this.context.setHostelType("girls");
  };

  render() {
    return (
      <div className="home-container">
        <Header />
        <div className="container1">
          <h1 className="home-heading">Choose the hostel</h1>
          <div className="hostel-type-container">
            <div className="image-container-hostel">
              <img src={boy} alt="boy" className="hostel-images" />
            </div>
            <Link className="boys" to="/boys" onClick={this.setBoys}>
              <h1 className="hostel-type">Boys</h1>
            </Link>
            <Link className="girls" to="/girls" onClick={this.setGirls}>
              <h1 className="hostel-type">Girls</h1>
            </Link>
            <div className="image-container-hostel">
              <img src={girl} alt="girl" className="hostel-images" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
