import { Component } from "react";
import Header from "../Header";
import './index.css'

class AddRoom extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="add-room-container">
          <form className="add-room-form">
            <div className="add-room-data">
                <label>Floor No</label>
                <input type='text'/>
            </div>
            <div className="add-room-data">
                <label>Room No</label>
                <input type='text'/>
            </div>
            <div className="add-room-data">
                <label>Student Capacity</label>
                <input type='text'/>
            </div>
            <div className="add-room-data">
                <label>Room Type</label>
                <select>
                    <option>AC</option>
                    <option>Non-AC</option>
                </select>
            </div>
            <div className="add-room-data">
                <label>Washroom Type</label>
                <select>
                    <option>Attached</option>
                    <option>Non-Attached</option>
                </select>
            </div>
            <div>
                <button>Add</button>
                <button>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddRoom;
