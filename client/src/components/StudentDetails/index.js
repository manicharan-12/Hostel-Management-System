const StudentDetails = (props) => {
  const { details } = props;
  const {
    student_name,
    hall_ticket_number,
    branch,
    current_year,
    mobile_number,
    room_no,
  } = details;
  return (
    <>
      <li className="table-row-student">
        <div className="col col-student" data-label="Name">
          <p>{student_name}</p>
        </div>
        <div className="col col-student" data-label="Hall Ticket Number">
          <p>{hall_ticket_number}</p>
        </div>
        <div className="col col-student" data-label="Branch">
          <p>{branch}</p>
        </div>
        <div className="col col-student" data-label="Year">
          <p>{current_year}</p>
        </div>
        <div className="col col-student" data-label="Mobile Number">
          <p>{mobile_number}</p>
        </div>
        <div className="col col-student" data-label="Room No">
          <p>{room_no}</p>
        </div>
      </li>
    </>
  );
};

export default StudentDetails;
