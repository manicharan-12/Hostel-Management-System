import "./index.css";
import { MdDelete } from "react-icons/md";

const FloorDetails = (props) => {
  const { details, onClickDeleteFloor } = props;
  const {
    available_students,
    floor_no,
    id,
    no_of_rooms,
    present_students,
    total_students,
  } = details;

  const available_color = available_students > 0 ? "#22bb33" : "#bb2124";
  const present_color =
    present_students === total_students ? "#bb2124" : "#22bb33";

  return (
    <li className="table-row-floor">
      <div className="col col-floor" data-label="Floor Number">
        <p>{floor_no}</p>
      </div>
      <div className="col col-floor" data-label="Number Of Rooms">
        <p>{no_of_rooms}</p>
      </div>
      <div className="col col-floor" data-label="Present Students">
        <p style={{ color: present_color, fontWeight: "bolder" }}>
          {present_students}
        </p>
      </div>
      <div className="col col-floor" data-label="Available Students">
        <p style={{ color: available_color, fontWeight: "bolder" }}>
          {available_students}
        </p>
      </div>
      <div className="col col-floor" data-label="Total Students">
        <p>{total_students}</p>
      </div>
      <div className="col col-floor" data-label="Delete">
        <MdDelete
          className="delete-icon"
          onClick={() => onClickDeleteFloor(id)}
        />
      </div>
    </li>
  );
};

export default FloorDetails;
