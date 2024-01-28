import { Component } from "react";
import Header from "../Header";
import "./index.css";
import Back from "../Back";

class AddRoom extends Component {
  state = {
    floorNo: "",
    roomNo: "",
    total: "",
    roomType: "AC",
    washroomType: "Attached",
    hostelType: "",
    errorMsg: "",
    errorStatus: false,
  };

  componentDidMount() {
    const { hostelType } = this.props.match.params;
    this.setState({ hostelType: hostelType });
  }

  renderFloorNo = (event) => {
    this.setState({ floorNo: event.target.value });
  };

  renderRoomNo = (event) => {
    this.setState({ roomNo: event.target.value });
  };

  renderCapacity = (event) => {
    this.setState({ total: event.target.value });
  };
  renderRoomType = (event) => {
    this.setState({ roomType: event.target.value });
  };
  renderWashroomType = (event) => {
    this.setState({ washroomType: event.target.value });
  };

  addRoom = async (event) => {
    event.preventDefault();
    const { floorNo, roomNo, total, roomType, washroomType, hostelType } =
      this.state;
    if (floorNo === "" || roomNo === "" || total === "") {
      this.setState({
        errorStatus: true,
        errorMsg: "All Fields Need to be Filled",
      });
    } else {
      this.setState({ errorStatus: false, errorMsg: "" });
      const api = `http://localhost:8000/room-data/add/room/${hostelType}`;
      const postRoom = { floorNo, roomNo, total, roomType, washroomType };
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postRoom),
      };
      const response = await fetch(api, option);
      if (response.ok === true) {
        this.props.history.replace({
          pathname: `/room-data/${hostelType}`,
          state: { hostel_type: `${hostelType}` },
        });
      } else {
        const data = await response.json();
        this.setState({ errorStatus: true, errorMsg: data.error_msg });
      }
    }
  };

  render() {
    const { errorStatus, errorMsg } = this.state;
    return (
      <div>
        <Header />
        <Back />
        <div className="add-room-main-container">
          <h1>Add Room</h1>
          <p>Fill out the all the mentioned room details in the below form</p>
          <div className="add-room-container">
            <form className="add-room-form" onSubmit={this.addRoom}>
              <div className="add-room-data">
                <label>Floor No</label>
                <input type="text" onChange={this.renderFloorNo} />
              </div>
              <div className="add-room-data">
                <label>Room No</label>
                <input type="text" onChange={this.renderRoomNo} />
              </div>
              <div className="add-room-data">
                <label>Student Capacity</label>
                <input type="text" onChange={this.renderCapacity} />
              </div>
              <div className="add-room-data">
                <label>Room Type</label>
                <select onChange={this.renderRoomType}>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>
              <div className="add-room-data">
                <label>Washroom Type</label>
                <select onChange={this.renderWashroomType}>
                  <option value="Attached">Attached</option>
                  <option value="Non-Attached">Non-Attached</option>
                </select>
              </div>
              <div className="add-room-button-container">
                <button className="button-1" type="submit">
                  Add
                </button>
                <button
                  className="button-2"
                  type="button"
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                >
                  Cancel
                </button>
              </div>
              {errorStatus === true ? (
                <div className="error-msg-container-floor">
                  <p className="error-msg-add-floor">{errorMsg}</p>
                </div>
              ) : (
                <div>
                  <p></p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddRoom;
