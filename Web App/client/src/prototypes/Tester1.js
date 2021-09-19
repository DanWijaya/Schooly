import React from "react";
import { Button, List, ListItem } from "@material-ui/core";
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
    <div>
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
      <List>
        <ListItem>
          Test
        </ListItem>
        <ListItem>
          Test
        </ListItem>
      </List>
    </div>
  );
}

export default Tester;
