import { Component } from "react";
import loginImage from "../Images/LoginImage.png";
import Cookies from "js-cookie";
import "./index.css";
import { Redirect, withRouter } from "react-router-dom";

class Login extends Component {
  state = { email: "", password: "", errorMsg: "" };

  onSubmitSuccess = (jwtToken) => {
    const { history } = this.props;
    Cookies.set("jwt_token", jwtToken, { expires: 1, path: "/" });
    history.replace("/");
  };

  submitField = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const url = "http://localhost:8000/login/main-admin/";
    const postObject = { email: email, password: password };
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
      this.onSubmitSuccess(data.jwt_token);
    } else {
      this.setState({ errorMsg: data.error_msg });
    }
  };

  renderEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  renderPassword = (event) => {
    this.setState({ password: event.target.value });
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
              <div className="button-container">
                <button type="submit" className="login-button">
                  Login
                </button>
              </div>
            </form>
            <p className="error-msg">{errorMsg}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
