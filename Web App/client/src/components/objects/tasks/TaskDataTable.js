import React, { Component } from 'react';

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
                    <button className="btn btn-primary">Edit</button>
                 </td>
                <td style={{textAlign: "center"}}>
                    <button className="btn btn-danger">Delete</button>
                </td>
            </tr>
        )
    }
}

export default TaskDataTable;