import { withRouter } from "react-router-dom";
import { Component } from "react";
import Header from "../Header";
import Back from "../Back";
import "./index.css";

class AddAdmin extends Component {
  state = {
    isDisabled: true,
    email: "",
    password: "",
    adminType: "",
    hostel_type: "both",
    error_msg: "",
    isError: false,
    name: "",
  };

  addAdminData = async (event) => {
    event.preventDefault();
    const { email, password, adminType, hostel_type, name } = this.state;
    console.log(email, password, adminType, hostel_type);
    if (email === "" || password === "" || adminType === "" || name === "") {
      this.setState({
        error_msg: "All fields need to be filled",
        isError: true,
      });
    } else {
      if (adminType === "admin") {
        if (hostel_type === "both") {
          this.setState({
            error_msg: "Please select the Hostel Type",
            isError: true,
          });
        } else {
          const api = `http://localhost:8000/add/admin/data`;
          const postAdmin = {
            email,
            password,
            admin_type: adminType,
            hostel_type,
            name,
          };
          const option = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postAdmin),
          };
          const response = await fetch(api, option);
          if (response.ok === true) {
            this.props.history.replace({ pathname: "/boys" });
          } else {
            const data = await response.json();
            this.setState({ errorStatus: true, errorMsg: data.error_msg });
          }
        }
      } else {
        const api = `http://localhost:8000/add/admin/data`;
        const postAdmin = {
          email,
          password,
          admin_type: adminType,
          hostel_type,
          name,
        };
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postAdmin),
        };
        const response = await fetch(api, option);
        if (response.ok === true) {
          this.props.history.replace({ pathname: "/boys" });
        } else {
          const data = await response.json();
          this.setState({ errorStatus: true, errorMsg: data.error_msg });
        }
      }
    }
  };

  renderEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  renderPassword = (event) => {
    this.setState({ password: event.target.value });
  };

  renderAdminType = async (event) => {
    await this.setState({ adminType: event.target.value });

    const { adminType } = this.state;
    if (adminType !== "super admin") {
      this.setState({ isDisabled: false, hostel_type: "both" });
    } else {
      this.setState({ isDisabled: true });
    }
  };

  renderName = (event) => {
    this.setState({ name: event.target.value });
  };

  renderHostelType = (event) => {
    this.setState({ hostel_type: event.target.value });
  };

  render() {
    const { isDisabled, error_msg } = this.state;
    const cursor = isDisabled ? "not-allowed" : "";
    return (
      <>
        <Header />
        <Back />
        <div className="add-admin-main-container">
          <div className="add-admin-container">
            <h2>Add all the Admin Details Below</h2>
            <form className="add-admin-form" onSubmit={this.addAdminData}>
              <div className="add-admin-input-container">
                <label htmlFor="name">Name:</label>
                <input
                  type="name"
                  id="name"
                  onChange={this.renderName}
                  className="add-admin-input"
                />
              </div>
              <div className="add-admin-input-container">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  className="add-admin-input"
                  id="email"
                  onChange={this.renderEmail}
                />
              </div>
              <div className="add-admin-input-container">
                <label htmlFor="password">Password:</label>
                <input
                  type="text"
                  className="add-admin-input"
                  id="password"
                  onChange={this.renderPassword}
                />
              </div>
              <div className="add-admin-input-container">
                <label htmlFor="adminType">Admin Type:</label>
                <select
                  className="add-admin-input"
                  onChange={this.renderAdminType}
                  id="adminType"
                >
                  <option>Choose the admin type</option>
                  <option value="super admin">Super Admin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="add-admin-input-container">
                <label>Hostel Type</label>
                <div>
                  <input
                    type="radio"
                    className="add-admin-input-radio"
                    disabled={isDisabled}
                    style={{ cursor: cursor, backGround: "gary" }}
                    value="boys"
                    name="hostelType"
                    id="boys"
                    onChange={this.renderHostelType}
                  />
                  <label htmlFor="boys">Boys</label>
                  <input
                    type="radio"
                    className="add-admin-input-radio"
                    disabled={isDisabled}
                    style={{ cursor: cursor, backGround: "gary" }}
                    value="girls"
                    name="hostelType"
                    id="girls"
                    onChange={this.renderHostelType}
                  />
                  <label htmlFor="girls">Girls</label>
                </div>
              </div>
              <div>
                <button type="submit" className="add-admin-button">
                  Add Admin
                </button>
              </div>
              <p style={{ color: "red", marginTop: "8px" }}>{error_msg}</p>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(AddAdmin);
