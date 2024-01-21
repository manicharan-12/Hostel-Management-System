import Popup from 'reactjs-popup'
import {withRouter, Link} from 'react-router-dom'
import logo from '../Images/logo.png'
import './index.css'
import Cookies from 'js-cookie'
const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/')
  }
  return (
    <nav className="header-container">
      <Link to="/" className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </Link>
      <div className="logout-container">
        <Popup
          trigger={<button className="button logout-button"> LogOut </button>}
          modal
          nested
        >
          {close => (
            <div className="modal">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header"> </div>
              <div className="content"> Are you sure want to logout?</div>
              <div className="actions">
                <button
                  className="button modal-buttons"
                  onClick={() => {
                    close()
                  }}
                >
                  Cancel
                </button>
                <button className="modal-buttons" onClick={onClickLogout}>
                  Confirm
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </nav>
  )
}

export default withRouter(Header)
