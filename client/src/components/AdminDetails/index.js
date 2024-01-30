import { MdDelete } from "react-icons/md";
import "./index.css";

const AdminDetails = (props) => {
  const { details, onClickDeleteAdmin } = props;
  const { name, id, email, role } = details;
  return (
    <div>
      <li className="table-row-admin">
        <div className="col col-admin" data-label="Name">
          <p>{name}</p>
        </div>
        <div className="col col-admin" data-label="Email">
          <p>{email}</p>
        </div>

        <div className="col col-admin" data-label="Role">
          <p>{role === "super admin" ? "Super Admin" : "Admin"}</p>
        </div>
        <div className="col col-admin">
          <button className="update-detail-button">Update Password</button>
        </div>
        <div className="col col-admin">
          <MdDelete
            className="delete-icon"
            onClick={() => onClickDeleteAdmin(id)}
          />
        </div>
      </li>
    </div>
  );
};

export default AdminDetails;
