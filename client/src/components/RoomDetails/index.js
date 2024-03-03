import { withRouter } from "react-router-dom";
import "./index.css";
import { MdDelete } from "react-icons/md";

const RoomData = (props) => {
  const { details, onClickDeleteRoom } = props;
  const {
    id,
    available_students,
    floor_no,
    present_students,
    room_no,
    room_type,
    total_students,
    washroom_type,
  } = details;
  const available_color = available_students > 0 ? "#22bb33" : "#bb2124";
  const present_color =
    present_students === total_students ? "#bb2124" : "#22bb33";

  function getViewData(id) {
    props.history.push({
      pathname: `/room/student-data/${id}`,
      state: { id: id },
    });
  }

  return (
    <div className="room-data-box">
      <div className="room-data">
        <div className="room-content" style={{ textAlign: "right" }}>
          Floor No:
        </div>
        <div className="room-content" style={{ paddingLeft: "10px" }}>
          {floor_no}
        </div>
      </div>
      <div className="room-data">
        <div className="room-content" style={{ textAlign: "right" }}>
          Room No:
        </div>
        <div className="room-content" style={{ paddingLeft: "10px" }}>
          {room_no}
        </div>
      </div>
      <div
        className="room-data"
        style={{ color: present_color, fontWeight: "bolder" }}
      >
        <div className="room-content" style={{ textAlign: "right" }}>
          Present Students:
        </div>
        <div className="room-content" style={{ paddingLeft: "10px" }}>
          {present_students}
        </div>
      </div>
      <div
        className="room-data"
        style={{ color: available_color, fontWeight: "bolder" }}
      >
        <div className="room-content" style={{ textAlign: "right" }}>
          Available Students:
        </div>
        <div className="room-content" style={{ paddingLeft: "10px" }}>
          {available_students}
        </div>
      </div>
      <div className="room-data" style={{ fontWeight: "bolder" }}>
        <div className="room-content" style={{ textAlign: "right" }}>
          Total Students:
        </div>
        <div className="room-content" style={{ paddingLeft: "10px" }}>
          {total_students}
        </div>
      </div>
      <div className="room-data">
        <div className="room-content" style={{ textAlign: "right" }}>
          Room Type:
        </div>
        <div className="room-content" style={{ paddingLeft: "10px" }}>
          {room_type}
        </div>
      </div>
      <div className="room-data">
        <div className="room-content" style={{ textAlign: "right" }}>
          Washroom Type:
        </div>
        <div className="room-content" style={{ paddingLeft: "10px" }}>
          {washroom_type}
        </div>
      </div>
      <div style={{ padding: "10px 0" }}>
        <button className="room-view-button" onClick={() => getViewData(id)}>
          View Details
        </button>
      </div>
      <div className="">
        <MdDelete
          className="delete-icon"
          onClick={() => onClickDeleteRoom(id)}
        />
      </div>
    </div>
  );
};

export default withRouter(RoomData);
