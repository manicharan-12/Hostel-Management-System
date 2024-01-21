import {Route, Switch, Redirect, withRouter} from 'react-router-dom'
import Login from './components/LoginForm'
import Home from './components/Home'
import Boys from './components/BoysHome'
import ProtectedRoute from './components/ProtectedRoute'
import Girls from './components/GirlsHome'

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/login/admin" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/boys" component={Boys} />
        <ProtectedRoute exact path="/girls" component={Girls} />
        <Redirect to="/" />
      </Switch>
    </>
  )
}

export default withRouter(App)
