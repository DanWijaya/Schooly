import React, { Component } from 'react';

class ClassDataTable extends Component {

    render(){
        return(
            <tr>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.name}
                </td>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.walikelas}
                </td>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.ukuran}
                </td>
                <td style={{textAlign: "center"}}>
                    {this.props.obj.nihil.toString()}
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

export default ClassDataTable;