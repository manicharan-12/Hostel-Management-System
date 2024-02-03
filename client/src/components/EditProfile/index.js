import { Component } from "react";
import Header from "../Header";
import Back from "../Back";
import Cookies from "js-cookie";
import { Puff, MagnifyingGlass } from "react-loader-spinner";
import failure from "../Images/failure-image.png";
import axios from "axios";
import "./index.css";
import { FcCheckmark } from "react-icons/fc";
import { FaXmark } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class EditProfile extends Component {
  state = {
    hostelType: "",
    apiStatus: apiStatusConstants.initial,
    id: "",
    name: "",
    email: "",
    isChangePassword: false,
    isDisabled: true,
    currentPassword: "",
    checkPasswordStatus: apiStatusConstants.initial,
    checkPasswordClicked: false,
    isPasswordCorrect: false,
    newPassword: "",
    confirmPassword: "",
    error_msg: "",
  };

  componentDidMount() {
    const { hostelType } = this.props.match.params;
    const id = Cookies.get("id");
    this.setState({ hostelType: hostelType, id: id }, () => {
      this.getAdminData();
    });
  }

  getAdminData = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const { id } = this.state;
    const url = `http://localhost:8000/get-admin/${id}`;
    const response = await fetch(url);
    if (response.status !== 200) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    } else {
      const data = await response.json();
      const adminDetails = data.adminDetails;
      const { email, name } = adminDetails;
      this.setState({
        apiStatus: apiStatusConstants.success,
        email: email,
        name: name,
      });
    }
  };

  updateDetails = async (event) => {
    event.preventDefault();
    const { name, newPassword, confirmPassword, id } = this.state;
    if (newPassword !== confirmPassword) {
      this.setState({ error_msg: "Password Doesn't match" });
    } else {
      const url = `http://localhost:8000/update-details/${id}`;
      const putDetails = { name, password: newPassword };
      const option = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(putDetails),
      };
      const response = await fetch(url, option);
      if (response.status === 200) {
        this.setState({
          apiStatus: apiStatusConstants.success,
          isChangePassword: false,
          isDisabled: true,
          currentPassword: "",
          checkPasswordStatus: apiStatusConstants.initial,
          checkPasswordClicked: false,
          isPasswordCorrect: false,
          newPassword: "",
          confirmPassword: "",
          error_msg: "",
        });
        toast.success("Profile Updated Successfully", {
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
    }
  };

  checkPassword = async () => {
    const { currentPassword, id } = this.state;
    this.setState({ checkPasswordStatus: apiStatusConstants.inProgress });
    await axios
      .post(`http://localhost:8000/check-password/${id}`, {
        password: currentPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isPasswordCorrect: true,
            checkPasswordStatus: apiStatusConstants.success,
            isDisabled: false,
          });
        } else {
          this.setState({ checkPasswordStatus: apiStatusConstants.failure });
        }
      })
      .catch((error) => {
        this.setState({ checkPasswordStatus: apiStatusConstants.failure });
      });
  };

  renderName = (event) => {
    this.setState({ name: event.target.value });
  };

  renderCurrentPassword = (event) => {
    this.setState({ currentPassword: event.target.value });
  };

  renderNewPassword = (event) => {
    this.setState({ newPassword: event.target.value });
  };

  renderConfirmPassword = (event) => {
    this.setState({ confirmPassword: event.target.value });
  };

  checkPasswordCorrect = () => {
    const { checkPasswordStatus } = this.state;
    switch (checkPasswordStatus) {
      case apiStatusConstants.success:
        return <FcCheckmark />;

      case apiStatusConstants.inProgress:
        return (
          <MagnifyingGlass
            visible={true}
            height="30"
            width="30"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperClass="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#e15b64"
          />
        );
      case apiStatusConstants.failure:
        return <FaXmark color="#e15b64" />;
      default:
        break;
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
    const {
      isChangePassword,
      isDisabled,
      email,
      name,
      newPassword,
      confirmPassword,
    } = this.state;
    const bgColor =
      isDisabled === true
        ? {
            background: "#EBEBE4",
            color: "#C6C6C6",
            borderColor: "rgba(118, 118, 118, 0.3)",
            cursor: "not-allowed",
          }
        : {};
    const bgColor2 =
      isDisabled === false
        ? {
            background: "#EBEBE4",
            color: "#C6C6C6",
            borderColor: "rgba(118, 118, 118, 0.3)",
            cursor: "not-allowed",
          }
        : {};
    return (
      <div className="edit-profile-main-container">
        <div className="edit-profile-container">
          <h1>Admin Details</h1>
          <form className="edit-profile-form" onSubmit={this.updateDetails}>
            <div className="edit-profile-input-container">
              <label>Email:</label>
              <input
                type="text"
                disabled
                className="edit-profile-input"
                style={{
                  background: "#EBEBE4",
                  color: "#C6C6C6",
                  borderColor: "rgba(118, 118, 118, 0.3)",
                  cursor: "not-allowed",
                }}
                value={email}
              />
            </div>
            <div className="edit-profile-input-container">
              <label>Name:</label>
              <input
                type="text"
                className="edit-profile-input"
                value={name}
                onChange={this.renderName}
              />
            </div>
            <div className="edit-profile-input-container">
              {isChangePassword === false ? (
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ isChangePassword: true });
                  }}
                >
                  Change Password
                </button>
              ) : (
                ""
              )}
              {isChangePassword === true ? (
                ""
              ) : (
                <button type="submit">Save Details</button>
              )}
            </div>

            {isChangePassword === true ? (
              <>
                <div className="edit-profile-input-container">
                  <label>Current Password:</label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      className="edit-profile-input"
                      disabled={!isDisabled}
                      onChange={this.renderCurrentPassword}
                      style={bgColor2}
                    />
                    <div className="icons-container">
                      {this.checkPasswordCorrect()}
                    </div>
                  </div>
                </div>

                <div className="check-password-container">
                  <button type="button" onClick={this.checkPassword}>
                    Check Password
                  </button>
                </div>
                <div className="edit-profile-input-container">
                  <label>New Password</label>
                  <input
                    className="edit-profile-input"
                    disabled={isDisabled}
                    style={bgColor}
                    value={newPassword}
                    onChange={this.renderNewPassword}
                  />
                </div>
                <div className="edit-profile-input-container">
                  <label>Confirm Password</label>
                  <input
                    className="edit-profile-input"
                    disabled={isDisabled}
                    style={bgColor}
                    value={confirmPassword}
                    onChange={this.renderConfirmPassword}
                  />
                </div>
                <div className="edit-profile-input-container">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({
                        isChangePassword: false,
                        isPasswordCorrect: false,
                        checkPasswordStatus: apiStatusConstants.initial,
                        isDisabled: true,
                        currentPassword: "",
                        confirmPassword: "",
                        newPassword: "",
                      });
                    }}
                    style={{ backgroundColor: "gray", color: "#ffffff" }}
                  >
                    Cancel
                  </button>
                  <button type="submit">Save Details</button>
                </div>
              </>
            ) : (
              ""
            )}
          </form>
        </div>
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
        {this.renderAdminData()}
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

export default EditProfile;
