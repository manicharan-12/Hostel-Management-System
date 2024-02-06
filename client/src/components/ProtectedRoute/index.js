import { Redirect, Route } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = (props) => {
  const jwtToken = Cookies.get("jwt_token");
  const role = Cookies.get("role");
  const hostel_type = Cookies.get("hostel_type");
  if (jwtToken === undefined) {
    return <Redirect to="/hostel/login" />;
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
        if (props.location.pathname.includes("girls")) {
          return <Redirect to="/no-access" />;
        }
      }
      if (hostel_type === "girls") {
        if (props.location.pathname.includes("boys")) {
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
