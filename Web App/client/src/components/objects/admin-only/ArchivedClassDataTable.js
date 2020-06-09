// Nanti bakal ganti viewnya di sidebarnya? 
import React, { Component } from "react";
import { Link } from "react-router-dom";

class ClassDataTable extends Component {

    render(){
        return (
            <tr>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.name}
                </td>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.walikelas.name}
                </td>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.ukuran}
                </td>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.nihil.toString()}
                </td>
                <td style={{textAlign: "center"}}>
                <Link to={{
                    pathname: `/editclass/${this.props.obj._id}`,
                    state:{ 
                        classId : this.props.obj._id
                        }
                    }}
                className="btn btn-primary">Edit</Link>
                 </td>
                <td style={{textAlign: "center"}}>
                    <Link to={{
                        pathname: `/deleteclass/${this.props.obj._id}`,
                        state:{
                            classId : this.props.obj._id
                        }
                    }}
                    className="btn btn-danger">Delete</Link>
                </td>
            </tr>
        )
    }
}

export default ClassDataTable;