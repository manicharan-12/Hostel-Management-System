import { Component } from "react"
import Header from "../Header"


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
  }

class Floor extends Component{
    state={apiStatus:apiStatusConstants.initial}

    componentDidMount(){
        this.getFloorDetails()
    }

    getFloorDetails=async ()=>{
        this.setState({apiStatus:apiStatusConstants.inProgress})
        const api='http://localhost:8000/'
    }


    render(){
        return(
            <>
                <Header/>
                
            </>
        )
    }
}

export default Floor
