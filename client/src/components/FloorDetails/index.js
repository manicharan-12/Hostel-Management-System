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

  return (
    <tr>
      <td>{floor_no}</td>
      <td>{no_of_rooms}</td>
      <td>{present_students}</td>
      <td>{available_students}</td>
      <td>{total_students}</td>
      <td>
        <MdDelete
          className="delete-icon"
          onClick={() => onClickDeleteFloor(id)}
        />
      </td>
    </tr>
  );
};

export default FloorDetails;
