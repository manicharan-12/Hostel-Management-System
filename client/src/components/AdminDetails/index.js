import { MdDelete } from "react-icons/md";
import "./index.css";
import Cookies from "js-cookie";

const AdminDetails = (props) => {
  const { details, onClickDeleteAdmin, onClickUpdatePassword } = props;
  const { name, id, email, role, hostel_type } = details;
  const cookieId = Cookies.get("id");
  const isDisabled = id === cookieId;
  const isDisabledStyle = { color: "gary", cursor: "not-allowed" };
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

        <div className="col col-admin" data-label="Email">
          <p>{hostel_type.charAt(0).toUpperCase() + hostel_type.slice(1)}</p>
        </div>
        <div className="col col-admin">
          <button
            className="update-detail-button"
            onClick={() => onClickUpdatePassword(id)}
          >
            Update Password
          </button>
        </div>
        <div className="col col-admin">
          <MdDelete
            className="delete-icon"
            onClick={() => {
              if (!isDisabled) {
                onClickDeleteAdmin(id);
              }
            }}
            style={isDisabled ? { ...isDisabledStyle } : {}}
          />
        </div>
      </li>
    </div>
  );
};

export default AdminDetails;
