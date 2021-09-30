import React from "react";
import { Avatar, IconButton, Button, Grid, List, ListItem, Typography } from "@material-ui/core";
import {
  LibraryBooks as LibraryBooksIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import DeleteDialog from "../components/misc/dialog/DeleteDialog";
import UploadDialog from "../components/misc/dialog/UploadDialog";
import SubmitDialog from "../components/misc/dialog/SubmitDialog";

const useStyles = makeStyles((theme) => ({
}));

function Tester(props) {
  const classes = useStyles();

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const [openUploadDialog, setOpenUploadDialog] = React.useState(null);
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const [openSubmitDialog, setOpenSubmitDialog] = React.useState(null);
  const handleOpenSubmitDialog = () => {
    setOpenSubmitDialog(true);
  };
  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false);
  };

  return (
    <div style={{maxWidth: "80%", margin: "auto"}}>
      <Button onClick={handleOpenDeleteDialog}>
        Delete
      </Button>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="tugas"
        itemName="bla bla bla"
      />
      <Button onClick={handleOpenUploadDialog}>
        Upload
      </Button>
      <UploadDialog
        openUploadDialog={openUploadDialog}
        success={false}
        messageUploading="Tugas sedang dikumpul"
        messageSuccess="Tugas telah dikumpul"
        handleCloseUploadDialog={handleCloseUploadDialog}
      />
      <Button onClick={handleOpenSubmitDialog}>
        Submit
      </Button>
      <SubmitDialog
        openSubmitDialog={openSubmitDialog}
        handleCloseSubmitDialog={handleCloseSubmitDialog}
        itemType="Ujian"
        itemName="Nigga"
        loading={true}
        // onSubmit={onSubmit}
        messageLoading="Jawaban Anda sedang disimpan"
      />
      <Grid container spacing={2} wrap="nowrap">
        <Grid item>
          <Avatar/>
        </Grid>
        <Grid item xs container zeroMinWidth>
          <Grid item xs={12}>
            <Typography noWrap>
              AAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAa
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
              AAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAa
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Avatar/>
          <Avatar/>
        </Grid>
      </Grid>


      <Grid>
        <Grid container alignItems="stretch" justify="space-between" style={{border: "1px solid black"}}>
          <Grid item
            container alignItems="center" style={{backgroundColor: "blue", color: "white"
            , width: "70%"
          }}
          >
            <LibraryBooksIcon />
          </Grid>
          <Grid item style={{height: "100px"}}>
            Grid
          </Grid>
        </Grid>
      </Grid>
      <div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "stretch", border: "1px solid black"}}>
          <div
            style={{backgroundColor: "blue", color: "white", display: "flex", alignItems: "center"}}
          >
            <LibraryBooksIcon />
          </div>
          <div style={{height: "100px"}}>
            div
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tester;
