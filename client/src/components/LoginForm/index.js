import { Component } from "react";
import loginImage from "../Images/LoginImage.png";
import Cookies from "js-cookie";
import "./index.css";
import { Redirect, withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Login extends Component {
  state = { email: "", password: "", role: "", errorMsg: "" };

  onSubmitSuccess = async (jwtToken, email) => {
    try {
      const url = `http://localhost:8000/user-data/admin`;
      const postObject = { email };
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postObject),
      };
      const response = await fetch(url, option);
      const data = await response.json();
      const id = data.adminId;
      const hostel_type = data.hostel_type;
      const { role } = this.state;
      const { history } = this.props;
      Cookies.set("jwt_token", jwtToken, { expires: 1, path: "/" });
      Cookies.set("role", role, { expires: 1, path: "/" });
      Cookies.set("id", id, { expires: 1, path: "/" });
      Cookies.set("hostel_type", hostel_type, { expires: 1, path: "/" });
      if (role === "super admin" || role === "admin") {
        history.replace("/");
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

  submitField = async (event) => {
    try {
      event.preventDefault();
      const { email, password, role } = this.state;
      if (role === "super admin" || role === "admin") {
        const url = "http://localhost:8000/login/main-admin/";
        const postObject = { email: email, password: password, role: role };
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postObject),
        };
        const response = await fetch(url, option);
        const data = await response.json();
        if (response.ok === true) {
          this.onSubmitSuccess(data.jwt_token, email);
        } else {
          this.setState({ errorMsg: data.error_msg });
        }
      } else {
        this.setState({
          errorMsg: "Invalid Role. Please check to continue",
        });
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

  renderEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  renderPassword = (event) => {
    this.setState({ password: event.target.value });
  };

  renderRole = (event) => {
    this.setState({ role: event.target.value });
  };

  renderEmailField = () => {
    const { email } = this.state;
    return (
      <>
        <label htmlFor="email" className="labels">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="input-container"
          value={email}
          placeholder="Enter your Email Id"
          onChange={this.renderEmail}
        />
      </>
    );
  };

  renderPasswordField = () => {
    const { password } = this.state;
    return (
      <>
        <label htmlFor="password" className="labels">
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="input-container"
          value={password}
          placeholder="Enter Password"
          onChange={this.renderPassword}
        />
      </>
    );
  };

  renderRoleField = () => {
    const { role } = this.state;
    return (
      <>
        <label htmlFor="role" className="labels">
          Role:
        </label>
        <select
          className="input-container"
          id="role"
          onChange={this.renderRole}
          value={role}
        >
          <option value="">Choose Your Role from below</option>
          <option value="admin">Admin</option>
          <option value="super admin">Super Admin</option>
        </select>
      </>
    );
  };

  render() {
    const { errorMsg } = this.state;
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    return (
      <div className="main-container">
        <div className="container">
          <div className="image-container">
            <img src={loginImage} alt="login" />
          </div>
          <div className="foam-container">
            <h1 className="main-heading">Welcome Back!</h1>
            <form onSubmit={this.submitField}>
              <div className="email-container">{this.renderEmailField()}</div>
              <div className="email-container">
                {this.renderPasswordField()}
              </div>
              <div className="email-container">{this.renderRoleField()}</div>
              <div className="button-container">
                <button type="submit" className="login-button">
                  Login
                </button>
              </div>
            </form>
            <p className="error-msg">{errorMsg}</p>
          </div>
        </div>
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

export default withRouter(Login);
