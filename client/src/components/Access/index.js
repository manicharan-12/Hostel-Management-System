import "./index.css";
import access from "../Images/not allowed.png";
import Header from "../Header";
import Back from "../Back";

const Access = () => {
  return (
    <div className="access-container">
      <Header />
      <Back />
      <div className="access-container-content">
        <img src={access} alt="not allowed" className="no-access-image" />
        <h2 style={{ fontWeight: "Bolder" }}>
          You are not allowed to view this page!
        </h2>
      </div>
    </div>
  );
};

export default Access;
