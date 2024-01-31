import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import Login from "./components/LoginForm";
import Home from "./components/Home";
import HostelHome from "./components/HostelHome";
import ProtectedRoute from "./components/ProtectedRoute";
import Floor from "./components/FloorData";
import HostelType from "./context/hostelType";
import React from "react";
import { Component } from "react";
import Room from "./components/RoomData";
import AddRoom from "./components/AddRoom";
import Access from "./components/Access";
import AddAdmin from "./components/AddAdmin";
import EditAdmin from "./components/EditAdmin";
import StudentData from "./components/StudentData";
import AddStudent from "./components/AddStudent";
import ViewRoom from "./components/ViewRoom";

class HostelTypeProvider extends Component {
  state = {
    hostelType: "",
  };

  setHostelType = (hostelType) => {
    this.setState({ hostelType });
  };

  render() {
    return (
      <HostelType.Provider
        value={{
          hostelType: this.state.hostelType,
          setHostelType: this.setHostelType,
        }}
      >
        {this.props.children}
      </HostelType.Provider>
    );
  }
}

const App = () => {
  return (
    <HostelTypeProvider>
      <Switch>
        <Route exact path="/login/admin" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/edit-admin" component={EditAdmin} />
        <ProtectedRoute exact path="/add-admin" component={AddAdmin} />
        <ProtectedRoute exact path="/no-access" component={Access} />
        <ProtectedRoute exact path="/:hostelType" component={HostelHome} />
        <ProtectedRoute
          exact
          path="/room/student-data/:id"
          component={ViewRoom}
        />
        <ProtectedRoute
          exact
          path="/floor-data/:hostelType"
          component={Floor}
        />
        <ProtectedRoute exact path="/room-data/:hostelType" component={Room} />
        <ProtectedRoute
          exact
          path="/add-room/:hostelType"
          component={AddRoom}
        />
        <ProtectedRoute
          exact
          path="/student-data/:hostelType"
          component={StudentData}
        />
        <ProtectedRoute
          exact
          path="/add-student/:hostelType"
          component={AddStudent}
        />
        <Redirect to="/" />
      </Switch>
    </HostelTypeProvider>
  );
};

export default withRouter(App);
