import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'
import image from '../Images/manage.png'

const Girls = () => {
  return (
    <div className="main-container-home">
      <Header />
      <div className="home-container-2">
        <div className="image-container-home">
          <img src={image} alt="manage" className="manage-img" />
        </div>
        <div className="content-container">
          <div className="grid-box">
            <Link to="" className="box1 box">
              <h4 className="content">Get Student Details</h4>
            </Link>
            <Link to="" className="box1 box">
              <h4 className="content">Manage Students</h4>
            </Link>
            <Link to="" className="box1 box">
              <h4 className="content">Get Room details</h4>
            </Link>
            <Link to="" className="box1 box">
              <h4 className="content">Manage Rooms</h4>
            </Link>
            <Link to="" className="box1 box">
              <h4 className="content">Get Floor Details</h4>
            </Link>
            <Link to="" className="box1 box">
              <h4 className="content">Manage Floors</h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Girls
