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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    try {
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
    } catch (error) {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  renderRoomNO = (event) => {
    this.setState({ roomNo: event.target.value });
  };

  onClickDeleteRoom = async (id) => {
    const { roomData } = this.state;
    try {
      const { hostelType } = this.state;
      await axios.delete(
        `http://localhost:8000/room-data/delete/${hostelType}/${id}`,
      );
      this.setState({ roomNo: "" });
      const updatedList = roomData.filter((room) => room.id !== id);
      this.setState({ roomData: updatedList });
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
              <div className="room-boxes-container">
                {newRoomData.map((eachRoom) => (
                  <RoomData
                    key={eachRoom.id}
                    details={eachRoom}
                    onClickDeleteRoom={this.onClickDeleteRoom}
                  />
                ))}
              </div>
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

export default Room;
