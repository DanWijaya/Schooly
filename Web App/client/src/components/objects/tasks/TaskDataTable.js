// Nanti bakal ganti viewnya di sidebarnya? 
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EditTask from './EditTask';
class TaskDataTable extends Component {


    render(){
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
                    {this.props.obj.submitted.toString()}
                </td>
                <td style={{textAlign: "center"}}>
                {/* If want to pass datas, use this kind of Link format  */}
                <Link to={{
                    pathname: '/edittask',
                    state:{  taskId : this.props.obj._id
                        }
                 }} 
                 className="btn btn-primary">Edit</Link>
                 </td>
                <td style={{textAlign: "center"}}>
                    <button className="btn btn-danger">Delete</button>
                </td>
            </tr>
        )
    }
}

export default TaskDataTable;