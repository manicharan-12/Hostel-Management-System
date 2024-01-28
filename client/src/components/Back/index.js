import { withRouter } from "react-router-dom";
import "./index.css";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Back = (props) => {
  return (
    <div className="back-button-container">
      <buttton className="back-button" onClick={() => props.history.goBack()}>
        <MdOutlineKeyboardBackspace className="icon-back" />
        Back
      </buttton>
    </div>
  );
};

export default withRouter(Back);
