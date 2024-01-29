import "./index.css";
import access from "../Images/not allowed.png";

const Access = () => {
  return (
    <div className="access-container">
      <img src={access} alt="not allowed" />
      <p style={{ fontWeight: "Bolder" }}>
        You are not allowed to view this page!
      </p>
    </div>
  );
};

export default Access;
