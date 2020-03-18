import React, { Component } from "react";
import { deleteTask } from "../../../actions/TaskActions";

class DeleteTask extends Component {
        constructor() {
            super();
    
        this.state = {
            isDeleted: false,
            submitted: false,
        }
    }

   render() {
       document.title = "Schooly - Delete Task";
       const { errors } = this.state;
   } return(
    
   )
}

DeleteTask.propTypes = {
    deleteTask : PropTypes.func.isRequired,
    isDeleted: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    isDeleted: state.isDeleted
})

export default connect(
    mapStateToProps, { deleteTask }
) (DeleteTask)