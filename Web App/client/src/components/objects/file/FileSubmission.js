import React from "react";

const useStyles = makeStyles((theme) => ({
  chosen: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  uploaded: {
    backgroundColor: "#F2F2F2",
  },
  submittedBadge: {
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: theme.palette.success.main,
    color: "white",
  },
  submittedLateBadge: {
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: theme.palette.error.main,
    color: "white",
  },
  deleteTaskButton: {
    marginLeft: "10px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  wordFileTypeIcon: {
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    backgroundColor: "#FD931D",
  },
  otherFileTypeIcon: {
    backgroundColor: "#808080",
  },
}));

function FileSubmission(props) {
  const classes = useStyles();
  const {
    file_id,
    file_name,
    file_type,
    onDownloadFile,
    onPreviewFile,
    handleOpenDeleteDialog,
    type,
    handleLampiranDelete,
    i
  } = props;

  let displayedName = file_name;

  return (
    type === "chosen" ? (
      <Paper variant="outlined" className={classes.chosen}>
        <ListItem button>
          <ListItemAvatar>
            {file_type === "Word" ? (
              <Avatar className={classes.wordFileTypeIcon}>
                <FaFileWord />
              </Avatar>
            ) : file_type === "Excel" ? (
              <Avatar className={classes.excelFileTypeIcon}>
                <FaFileExcel />
              </Avatar>
            ) : file_type === "Gambar" ? (
              <Avatar className={classes.imageFileTypeIcon}>
                <FaFileImage />
              </Avatar>
            ) : file_type === "PDF" ? (
              <Avatar className={classes.pdfFileTypeIcon}>
                <FaFilePdf />
              </Avatar>
            ) : file_type === "Teks" ? (
              <Avatar className={classes.textFileTypeIcon}>
                <FaFileAlt />
              </Avatar>
            ) : file_type === "Presentasi" ? (
              <Avatar className={classes.presentationFileTypeIcon}>
                <FaFilePowerpoint />
              </Avatar>
            ) : file_type === "File Lainnya" ? (
              <Avatar className={classes.otherFileTypeIcon}>
                <FaFile />
              </Avatar>
            ) : null}
          </ListItemAvatar>
          <ListItemText
            primary={
              <Tooltip title={file_name} placement="top">
                <Typography noWrap>
                  {displayedName}
                </Typography>
              </Tooltip>
            }
            secondary={file_type}
          />
          <IconButton
            size="small"
            className={classes.deleteTaskButton}
            onClick={(e) => {
              handleLampiranDelete(e, i);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </Paper>
    ) : (
      <Paper variant="outlined" className={classes.uploaded}>
        <ListItem
          button
          onClick={() => {
            onPreviewFile(file_id, "tugas");
          }}
        >
          <ListItemAvatar>
            <Tooltip title={late ? "Terkumpul Telat" : "Telat"}>
              <Badge
                overlap="circle"
                badgeContent={
                  <PublishIcon
                    className={late ? classes.submittedLateBadge : classes.submittedBadge}
                    fontSize="small"
                  />
                }
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                {file_type === "Word" ? (
                  <Avatar className={classes.wordFileTypeIcon}>
                    <FaFileWord />
                  </Avatar>
                ) : file_type === "Excel" ? (
                  <Avatar className={classes.excelFileTypeIcon}>
                    <FaFileExcel />
                  </Avatar>
                ) : file_type === "Gambar" ? (
                  <Avatar className={classes.imageFileTypeIcon}>
                    <FaFileImage />
                  </Avatar>
                ) : file_type === "PDF" ? (
                  <Avatar className={classes.pdfFileTypeIcon}>
                    <FaFilePdf />
                  </Avatar>
                ) : file_type === "Teks" ? (
                  <Avatar className={classes.textFileTypeIcon}>
                    <FaFileAlt />
                  </Avatar>
                ) : file_type === "Presentasi" ? (
                  <Avatar className={classes.presentationFileTypeIcon}>
                    <FaFilePowerpoint />
                  </Avatar>
                ) : file_type === "File Lainnya" ? (
                  <Avatar className={classes.otherFileTypeIcon}>
                    <FaFile />
                  </Avatar>
                ) : null}
              </Badge>
            </Tooltip>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Tooltip title={file_name} placement="top">
                <Typography noWrap>
                  {displayedName}
                </Typography>
              </Tooltip>
            }
            secondary={file_type}
          />
          <IconButton
            size="small"
            className={classes.deleteTaskButton}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDeleteDialog(props.file_id, props.file_name);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </Paper>
    )
  );
}

export default FileSubmission;
