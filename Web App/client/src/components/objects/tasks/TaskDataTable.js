// Nanti bakal ganti viewnya di sidebarnya? 
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import Modal from 'react-modal';

class TaskDataTable extends Component {

    render(){
        const class_assigned= this.props.obj.class_assigned
        var classes = ""
        
        var i
        for (i = 0; i < class_assigned.length; i++) {
            classes = classes + class_assigned[i].name
            if(i != class_assigned.length - 1)
                classes = classes + ", "
          }

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
                    <td style={{textAlign: "center"}}>

                        {classes}
                    </td>
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