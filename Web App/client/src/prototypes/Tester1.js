import React from "react";
import { Bar, Pie } from "react-chartjs-2";
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

  //Pie Data
  const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
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
      {/*Comment Model*/}
      <Grid container direction="column" wrap="nowrap">
        <Grid item>
          <Grid container spacing={2} wrap="nowrap">
            <Grid item>
              <Avatar/>
            </Grid>
            <Grid item xs zeroMinWidth container>
              <Grid item xs={12}>
                <Typography variant="body2" noWrap>
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

      <div>
      <Pie data={data} />
      </div>

      <IconButton><LibraryBooksIcon /></IconButton>
    </div>
  );
}

export default Tester;
