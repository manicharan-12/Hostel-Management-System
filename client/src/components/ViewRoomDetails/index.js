import { MdDelete } from "react-icons/md";
import "./index.css";
const ViewRoomDetails = (props) => {
  const { details, onDeleteRoomStudent } = props;
  const {
    student_name,
    hall_ticket_number,
    branch,
    current_year,
    mobile_number,
    id,
  } = details;
  return (
    <li className="table-row-view-room">
      <div className="col col-view-room">
        <p>{student_name}</p>
      </div>
      <div className="col col-view-room">
        <p>{hall_ticket_number}</p>
      </div>
      <div className="col col-view-room">
        <p>{branch}</p>
      </div>
      <div className="col col-view-room">
        <p>{current_year}</p>
      </div>
      <div className="col col-view-room">
        <p>{mobile_number}</p>
      </div>
      <div className="col col-view-room">
        <MdDelete
          className="delete-icon"
          onClick={() => onDeleteRoomStudent(id)}
        />
      </div>
    </li>
  );
};

export default ViewRoomDetails;
