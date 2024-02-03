import { Redirect, Route } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = (props) => {
  const jwtToken = Cookies.get("jwt_token");
  const role = Cookies.get("role");
  const hostel_type = Cookies.get("hostel_type");
  if (jwtToken === undefined) {
    return <Redirect to="/login/admin" />;
  }
  if (role === "super admin" || role === "admin") {
    if (role === "admin") {
      if (props.path === "/edit-admin") {
        return <Redirect to="/no-access" />;
      }
      if (props.path === "/add-admin") {
        return <Redirect to="/no-access" />;
      }
      if (hostel_type === "boys") {
        if (
          props.location.pathname === "/girls" ||
          props.location.pathname === "/student-data/girls" ||
          props.location.pathname === "/add-student/girls" ||
          props.location.pathname === "/room-data/girls" ||
          props.location.pathname === "/floor-data/girls" ||
          props.location.pathname === "/add-room/girls"
        ) {
          return <Redirect to="/no-access" />;
        }
      }
      if (hostel_type === "girls") {
        if (
          props.location.pathname === "/boys" ||
          props.location.pathname === "/student-data/boys" ||
          props.location.pathname === "/add-student/boys" ||
          props.location.pathname === "/room-data/boys" ||
          props.location.pathname === "/floor-data/boys" ||
          props.location.pathname === "/add-room/boys"
        ) {
          return <Redirect to="/no-access" />;
        }
      }
    }
    return <Route {...props} />;
  } else {
    return <Redirect to="/no-access" />;
  }
};

export default ProtectedRoute;
