import { Link, withRouter } from "react-router-dom";
import Header from "../Header";
import "./index.css";
import image from "../Images/manage.png";
import HostelType from "../../context/hostelType";
import Back from "../Back";
import Cookies from "js-cookie";

const HostelHome = (props) => {
  let hostelType = props.match.params.hostelType;
  const role = Cookies.get("role");
  return (
    <HostelType.Consumer>
      {(value) => {
        if (value.hostelType === "") {
        } else {
          hostelType = value.hostelType;
        }
        return (
          <div className="main-container-home">
            <Header />
            <Back />
            <div className="home-container-2">
              <div className="image-container-home">
                <img src={image} alt="manage" className="manage-img" />
              </div>
              <div className="content-container">
                <div className="grid-box">
                  <Link
                    to={{
                      pathname: `/student-data/${hostelType}`,
                      state: { hostel_type: `${hostelType}` },
                    }}
                    className="box"
                  >
                    <h4 className="content">Students Data</h4>
                  </Link>
                  <Link
                    to={{
                      pathname: `/add-student/${hostelType}`,
                      state: { hostel_type: `${hostelType}` },
                    }}
                    className="box"
                  >
                    <h4 className="content">Add Student</h4>
                  </Link>
                  <Link
                    to={{
                      pathname: `/room-data/${hostelType}`,
                      state: { hostel_type: `${hostelType}` },
                    }}
                    className="box"
                  >
                    <h4 className="content">Room details</h4>
                  </Link>
                  <Link
                    to={{
                      pathname: `/floor-data/${hostelType}`,
                      state: { hostel_type: `${hostelType}` },
                    }}
                    className="box"
                  >
                    <h4 className="content">Floor Details</h4>
                  </Link>
                  {role === "super admin" ? (
                    <Link to="/add-admin" className="box">
                      <h4 className="content">Add Admin</h4>
                    </Link>
                  ) : (
                    ""
                  )}
                  {role === "super admin" ? (
                    <Link to="/edit-admin" className="box">
                      <h4 className="content">Admin Details</h4>
                    </Link>
                  ) : (
                    ""
                  )}
                  <Link to="" className="box">
                    <h4 className="content">Edit Profile</h4>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </HostelType.Consumer>
  );
};

export default withRouter(HostelHome);
