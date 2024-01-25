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
        <ProtectedRoute exact path="/:hostelType" component={HostelHome} />
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
        <Redirect to="/" />
      </Switch>
    </HostelTypeProvider>
  );
};

export default withRouter(App);
