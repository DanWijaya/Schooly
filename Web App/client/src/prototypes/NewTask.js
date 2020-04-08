import React from "react";
import Fab from '@material-ui/core/Fab';
//Icons
import AddIcon from '@material-ui/icons/Add';

function NewTask() {
  return(
    <div>
      <Fab variant="extended">
        <AddIcon />
        New Question
      </Fab>
    </div>
  )
}

export default NewTask;
