import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  test: {
    backgroundColor: "white",
  }
}));

function ProfileDataEditorDialog() {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      startIcon={<EditIcon />}
      style={{
        backgroundColor: "#DCDCDC",
        color: "black",
      }}
    >
      Sunting Profil
    </Button>
  )
}

export default ProfileDataEditorDialog;
