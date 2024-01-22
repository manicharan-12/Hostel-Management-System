import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'
import image from '../Images/manage.png'
import HostelType from '../../context/hostelType'

const Boys = () => {
 
  return (
    <HostelType.Consumer>
    {value=>{const {hostelType}=value
    console.log(hostelType)
    return(
     <div className="main-container-home">
      <Header />
      <div className="home-container-2">
        <div className="image-container-home">
          <img src={image} alt="manage" className="manage-img" />
        </div>
        <div className="content-container">
          <div className="grid-box">
            <Link to="" className="box">
              <h4 className="content">Get Students Data</h4>
            </Link>
            <Link to="" className="box">
              <h4 className="content">Add Student Data</h4>
            </Link>
            <Link to="" className="box">
              <h4 className="content">Get Room details</h4>
            </Link>
            <Link to="" className="box">
              <h4 className="content">Manage Rooms</h4>
            </Link>
            <Link to={`/floor-data/${hostelType}`} className="box">
              <h4 className="content">Floor Details</h4>
            </Link>
          </div>
        </div>
      </div>
      </div>
    )
  }}
  </HostelType.Consumer>
  )
}

export default Boys
