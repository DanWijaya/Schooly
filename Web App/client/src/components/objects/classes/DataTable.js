import React, { Component } from 'react';

class DataTable extends Component {

    render(){
        return(
            <tr>
                <td>
                    {this.props.obj.name}
                </td>
                <td>
                    {this.props.obj.walikelas}
                </td>
                <td>
                    {this.props.obj.ukuran}
                </td>
                <td>
                    {this.props.obj.nihil}
                </td>
                <td>
                    <button className="btn btn-primary">Edit</button>
                 </td>
                <td>
                    <button className="btn btn-danger">Delete</button>
                </td>
            </tr>
        )
    }
}

export default DataTable;