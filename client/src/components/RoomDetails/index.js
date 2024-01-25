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
  return (
    <li className="table-row">
      <div className="col col-1" data-label="Floor No">
        {floor_no}
      </div>
      <div className="col col-2" data-label="Room No">
        {room_no}
      </div>
      <div className="col col-3" data-label="Present Students">
        {present_students}
      </div>
      <div className="col col-4" data-label="Available Students">
        {available_students}
      </div>
      <div className="col col-5" data-label="Total Students">
        {total_students}
      </div>
      <div className="col col-6" data-label="Room Type">
        {room_type}
      </div>
      <div className="col col-7" data-label="Washroom Type">
        {washroom_type}
      </div>
      <div className="col col-8" data-label="">
        <button className="room-view-button">View Details</button>
      </div>
      <div className="col col-9">
        <MdDelete
          className="delete-icon"
          onClick={() => onClickDeleteRoom(id)}
        />
      </div>
    </li>
  );
};

export default RoomData;