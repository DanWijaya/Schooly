import React from "react";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

function NewTask() {
  return(
    <div><center>
      <Fab variant="extended">
        <AddIcon />
        New Question
      </Fab>
      </center>
    </div>
  )
}

export default NewTask;
