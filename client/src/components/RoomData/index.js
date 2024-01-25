import { Component } from "react";
import "./index.css";
import Header from "../Header";
import { Puff } from "react-loader-spinner";
import failure from "../Images/failure-image.png";
import RoomData from "../RoomDetails";
import noData from "../Images/no data.png";
import axios from "axios";
import { Link } from "react-router-dom";

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
  };

  componentDidMount() {
    const { hostel_type } = this.props.location.state;
    this.setState({ hostelType: hostel_type }, () => {
      this.getRoomData();
    });
  }

  getRoomData = async () => {
    const { hostelType } = this.state;
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const api = `http://localhost:8000/room-data/${hostelType}`;
    const response = await fetch(api);
    const data = await response.json();
    const roomData = data.roomData;
    console.log(roomData);
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
    this.getRoomData();
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
    const { roomData, roomNo, hostelType } = this.state;
    const length = roomData.length;
    console.log(roomData);
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
                <Link to={`/add-room/${hostelType}`} className="link-add-room">
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
            <div className="room-table">
              <ul className="responsive-table">
                <li className="table-header">
                  <div className="col col-1">Floor No</div>
                  <div className="col col-2">Room No</div>
                  <div className="col col-3">Present Students</div>
                  <div className="col col-4">Available Students</div>
                  <div className="col col-5">Total Students</div>
                  <div className="col col-6">Room Type</div>
                  <div className="col col-7">Washroom Type</div>
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
          <div>
            <div className="no-data-container">
              <img src={noData} alt="noData" className="no-data-image" />
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
        <div className="room-detail-container">{this.renderFloorData()}</div>
      </div>
    );
  }
}

export default Room;
