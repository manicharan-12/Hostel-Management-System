import { Component } from "react";
import "./index.css";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import failure from "../Images/failure-image.png";
import RoomData from "../RoomDetails";
import noData from "../Images/no data.png";
import axios from "axios";
import { Link } from "react-router-dom";
import Back from "../Back";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class Room extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    hostelType: "",
    roomData: [],
    roomNo: "",
    roomType: "",
    washroomType: "",
  };

  componentDidMount() {
    const { hostelType } = this.props.match.params;
    this.setState({ hostelType: hostelType }, () => {
      this.getRoomData();
    });
  }

  getRoomData = async () => {
    let { hostelType, roomType, washroomType } = this.state;
    if (roomType === "Both") {
      roomType = "";
    }
    if (washroomType === "Both") {
      washroomType = "";
    }
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const api = `http://localhost:8000/room-data/${hostelType}?room_type=${roomType}&washroom_type=${washroomType}`;
    const response = await fetch(api);
    const data = await response.json();
    const roomData = data.roomData;
    if (response.status !== 200) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    } else {
      this.setState({
        roomData: roomData,
        apiStatus: apiStatusConstants.success,
      });
    }
  };

  renderRoomNO = (event) => {
    this.setState({ roomNo: event.target.value });
  };

  onClickDeleteRoom = async (id) => {
    const { hostelType } = this.state;
    await axios.delete(
      `http://localhost:8000/room-data/delete/${hostelType}/${id}`,
    );
    this.setState({ roomNo: "" });
    this.getRoomData();
  };

  renderRoomType = (event) => {
    this.setState({ roomType: event.target.value }, this.getRoomData);
  };

  renderWashroomType = (event) => {
    this.setState({ washroomType: event.target.value }, this.getRoomData);
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
    const { roomData, roomNo, hostelType, roomType, washroomType } = this.state;
    const length = roomData.length;
    const newRoomData = roomData.filter((eachRoom) => {
      return eachRoom.room_no.toString().includes(roomNo.toString());
    });
    return (
      <>
        {length > 0 ? (
          <div className="floor-data-container">
            <div className="header-floor">
              <h1>Rooms Data</h1>
              <div>
                <Link
                  to={{
                    pathname: `/add-room/${hostelType}`,
                    state: { hostel_type: `${hostelType}` },
                  }}
                  className="link-add-room"
                >
                  <button className="room-view-button">Add Room</button>
                </Link>
                <input
                  type="text"
                  className="search-room"
                  placeholder="Search Room No"
                  onChange={this.renderRoomNO}
                />
              </div>
            </div>
            <div className="filter-container">
              <p className="filter-para">Filters</p>
              <select onChange={this.renderRoomType} value={roomType}>
                <option value="">Room Type</option>
                <option value="Both">Both</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
              <select onChange={this.renderWashroomType} value={washroomType}>
                <option value="">Washroom Type</option>
                <option value="Both">Both</option>
                <option value="Attached">Attached</option>
                <option value="Non-Attached">Non-Attached</option>
              </select>
            </div>
            <div className="room-table">
              <ul className="responsive-table">
                <li className="table-header">
                  <div className="col col-1">Floor No</div>
                  <div className="col col-2">Room No</div>
                  <div className="col col-3">
                    <p>Present</p> <p>Students</p>
                  </div>
                  <div className="col col-4">
                    <p>Available</p> <p>Students</p>
                  </div>
                  <div className="col col-5">
                    <p>Total</p> <p>Students</p>
                  </div>
                  <div className="col col-6">
                    <p>Room</p> <p>Type</p>
                  </div>
                  <div className="col col-7">
                    <p>Washroom</p> <p>Type</p>
                  </div>
                  <div className="col col-8"></div>
                  <div className="col col-9"></div>
                </li>
                {newRoomData.map((eachRoom) => (
                  <RoomData
                    key={eachRoom.id}
                    details={eachRoom}
                    onClickDeleteRoom={this.onClickDeleteRoom}
                  />
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="no-data-room-container">
            <div className="filter-container">
              <p className="filter-para">Filters</p>
              <select onChange={this.renderRoomType} value={roomType}>
                <option value="">Room Type</option>
                <option value="Both">Both</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
              <select onChange={this.renderWashroomType} value={washroomType}>
                <option value="">Washroom Type</option>
                <option value="Both">Both</option>
                <option value="Attached">Attached</option>
                <option value="Non-Attached">Non-Attached</option>
              </select>
            </div>
            <div className="no-data-container">
              <img src={noData} alt="noData" className="no-data-image" />
              <h2>No Rooms are available! Create a Room</h2>
            </div>
            <div className="add-room-button-container">
              <Link
                to={{
                  pathname: `/add-room/${hostelType}`,
                  state: { hostel_type: `${hostelType}` },
                }}
                className="link-add-room"
              >
                <button className="room-view-button">Add Room</button>
              </Link>
            </div>
          </div>
        )}
      </>
    );
  };

  renderFloorData = () => {
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
        <div className="room-detail-container">{this.renderFloorData()}</div>
      </div>
    );
  }
}

export default Room;
