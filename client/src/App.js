import {Route, Switch, Redirect, withRouter} from 'react-router-dom'
import Login from './components/LoginForm'
import Home from './components/Home'
import Boys from './components/BoysHome'
import ProtectedRoute from './components/ProtectedRoute'
import Girls from './components/GirlsHome'
import Floor from './components/FloorData'
import HostelType from './context/hostelType'
import React from 'react'

class HostelTypeProvider extends React.Component {
  state = {
    hostelType: ''
  }

  setHostelType = (hostelType) => {
    this.setState({ hostelType });
  }

  render() {
    return (
      <HostelType.Provider value={{
        hostelType: this.state.hostelType,
        setHostelType: this.setHostelType
      }}>
        {this.props.children}
      </HostelType.Provider>
    )
  }
}

const App = () => {
  return (
    <HostelTypeProvider>
      <Switch>
        <Route exact path="/login/admin" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/boys" component={Boys} />
        <ProtectedRoute exact path="/girls" component={Girls} />
        <ProtectedRoute exact path="/floor-data/:hostelType" component={Floor}/>
        <Redirect to="/" />
      </Switch>
    </HostelTypeProvider>
  )
}

export default withRouter(App);
