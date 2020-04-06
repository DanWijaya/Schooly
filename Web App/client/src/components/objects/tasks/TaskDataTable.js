// Nanti bakal ganti viewnya di sidebarnya? 
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import Modal from 'react-modal';

class TaskDataTable extends Component {

    // constructor(){
    //     super()
    
    //     this.state = {
    //         modalIsOpen: false,
    //         setIsOpen: false
    //     }
    // }
    //When the user clicks anywhere outside of the modal, close it. 

    // clickToClose = () => {
    //     let id = "id_" + this.props.obj._id;
    //     document.getElementById(id).style.display='none'
    // }

    // clickToShow = () => {
    //     let id = "id_" + this.props.obj._id;
    //     document.getElementById(id).style.display='block'
    // }

    render(){

        // // GEt the modal 
        // let id = "id_" + this.props.obj._id;
        // let modal = document.getElementById(id);

        // window.onclick = function(event) {
        //     if(event.target == modal ){
        //         modal.style.display = "none";
        //     }
        // }

        return(

                <tr>
                    <td style={{textAlign: "center"}}>
                        {this.props.obj.name}
                    </td>
                    <td style={{textAlign: "center"}}>
                        {this.props.obj.subject}
                    </td>
                    <td style={{textAlign: "center"}}>
                        {this.props.obj.deadline}
                    </td>
                    {/* <td style={{textAlign: "center"}}>
                        {this.props.obj.submitted.toString()}
                    </td> */}
                    <td style={{textAlign: "center"}}>
                    {/* If want to pass datas, use this kind of Link format  */}
                    <Link to={{
                        pathname: `/task/${this.props.obj._id}`,
                        state:{  
                            taskId : this.props.obj._id,
                        }
                    }} 
                    className="btn btn-primary">Edit</Link>
                    </td>
                    <td style={{textAlign: "center"}}>
                        <Link to={{
                            pathname: `/deletetask/${this.props.obj._id}`,
                            state:{ 
                                taskId: this.props.obj._id
                            }
                        }}
                        className="btn btn-danger">Delete</Link>
                    </td>
                </tr>
        )
    }
}

export default TaskDataTable;