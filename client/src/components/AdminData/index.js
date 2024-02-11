import { Component } from "react";
import Header from "../Header";
import Back from "../Back";
import "./index.css";
import AdminDetails from "../AdminDetails";
import axios from "axios";
import failure from "../Images/failure-image.png";
import { Puff } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class AdminData extends Component {
  state = { apiStatus: apiStatusConstants.initial, adminList: [] };

  componentDidMount() {
    this.getAdminData();
  }

  getAdminData = async () => {
    try {
      this.setState({ apiStatus: apiStatusConstants.inProgress });
      const api = "http://localhost:8000/admin-data";
      const response = await fetch(api);
      const data = await response.json();
      if (response.status !== 200) {
        this.setState({ apiStatus: apiStatusConstants.failure });
      } else {
        this.setState({
          apiStatus: apiStatusConstants.success,
          adminList: data.admin_list,
        });
      }
    } catch (error) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  onClickDeleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/delete/admin-data/${id}`);
      this.getAdminData();
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

  onClickUpdatePassword = (id) => {
    this.props.history.push({
      pathname: `/check-password/${id}`,
      state: { id: id },
    });
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
    const { adminList } = this.state;
    return (
      <div className="responsive-table edit-admin">
        <h1 style={{ marginBottom: "8px" }}>Admin Details</h1>
        <li className="table-header">
          <div className="col col-admin">
            <p>Name:</p>
          </div>
          <div className="col col-admin">
            <p>Email</p>
          </div>
          <div className="col col-admin">
            <p>Role</p>
          </div>

          <div className="col col-admin">
            <p>Hostel Type</p>
          </div>
          <div className="col col-admin"></div>
          <div className="col col-admin"></div>
        </li>
        {adminList.map((eachAdmin) => (
          <AdminDetails
            key={eachAdmin.id}
            details={eachAdmin}
            onClickDeleteAdmin={this.onClickDeleteAdmin}
            onClickUpdatePassword={this.onClickUpdatePassword}
          />
        ))}
      </div>
    );
  };

  renderAdminData = () => {
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
        <>{this.renderAdminData()}</>
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

export default AdminData;
