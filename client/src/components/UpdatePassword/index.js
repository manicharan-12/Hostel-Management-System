import { Component } from "react";
import Header from "../Header";
import Back from "../Back";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class updatePassword extends Component {
  state = { id: "", newPassword: "", confirmPassword: "", error_msg: "" };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ id: id });
  }

  updatePassword = async (event) => {
    try {
      event.preventDefault();
      const { newPassword, confirmPassword, id } = this.state;
      if (newPassword !== confirmPassword) {
        this.setState({ error_msg: "Password doesn't Match!" });
      } else {
        this.setState({ error_msg: "" });
        const url = `http://localhost:8000/update-details/${id}`;
        const putDetails = { name: "", password: newPassword };
        const option = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(putDetails),
        };
        const response = await fetch(url, option);
        if (response.status !== 200) {
          this.setState({ error_msg: "Failed to Update Password" });
        } else {
          this.setState({ newPassword: "", confirmPassword: "" });
          toast.success("Password Updated Successfully", {
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

  renderNewPassword = (event) => {
    this.setState({ newPassword: event.target.value });
  };

  renderConfirmPassword = (event) => {
    this.setState({ confirmPassword: event.target.value });
  };

  render() {
    const { newPassword, confirmPassword, error_msg } = this.state;
    return (
      <div>
        <Header />
        <Back />
        <div className="update-password-main-container">
          <div className="update-password-container">
            <form
              className="update-password-form"
              onSubmit={this.updatePassword}
            >
              <div className="update-password-input-container">
                <label>New Password</label>
                <input
                  className="update-password-input"
                  value={newPassword}
                  onChange={this.renderNewPassword}
                />
              </div>
              <div className="update-password-input-container">
                <label>Confirm Password</label>
                <input
                  className="update-password-input"
                  value={confirmPassword}
                  onChange={this.renderConfirmPassword}
                />
              </div>
              <div className="update-password-input-container">
                <button className="update-password-button" type="submit">
                  Update
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <p style={{ color: "red" }}>{error_msg}</p>
              </div>
            </form>
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
export default updatePassword;
