import "./index.css";
const ViewRoomDetails = (props) => {
  const { details } = props;
  const {
    student_name,
    hall_ticket_number,
    branch,
    current_year,
    mobile_number,
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
    </li>
  );
};

export default ViewRoomDetails;
