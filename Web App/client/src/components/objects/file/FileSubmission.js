import React from "react";
import {
  Avatar,
  Badge,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  FaFile,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import {
  Delete as DeleteIcon,
  Publish as PublishIcon,
} from "@material-ui/icons";

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
  deleteIconButton: {
    marginLeft: "7.5px",
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

const path = require("path");

function FileSubmission(props) {
  const classes = useStyles();
  const {
    data,
    onPreviewFile,
    handleLampiranDelete,
    handleOpenDeleteDialog,
  } = props;

  const isPreviewable = Boolean(onPreviewFile);
  const isDeletable =
    Boolean(handleOpenDeleteDialog) || Boolean(handleOpenDeleteDialog);

  const fileType = (filename) => {
    let ext_file = path.extname(filename);
    switch (ext_file) {
      case ".docx":
        return ["Word", <FaFileWord />, classes.wordFileTypeIcon];
      case ".xlsx":
      case ".csv":
        return ["Excel", <FaFileExcel />, classes.excelFileTypeIcon];

      case ".png":
      case ".jpg":
      case ".jpeg":
        return ["Gambar", <FaFileImage />, classes.imageFileTypeIcon];

      case ".pdf":
        return ["PDF", <FaFilePdf />, classes.pdfFileTypeIcon];

      case ".txt":
      case ".rtf":
        return ["Teks", <FaFileAlt />, classes.textFileTypeIcon];

      case ".ppt":
      case ".pptx":
        return [
          "Presentasi",
          <FaFilePowerpoint />,
          classes.presentationFileTypeIcon,
        ];

      default:
        return ["File Lainnya", <FaFile />, classes.otherFileTypeIcon];
    }
  };

  return data.map((row, idx) => {
    if (row.filename) {
      row.name = row.filename;
    }
    console.log(row);
    const [fileCategory, fileIcon, iconStyle] = fileType(row.name);
    if (isPreviewable) {
      return (
        <Grid item>
          <Paper variant="outlined" className={classes.uploaded}>
            <ListItem
              button
              onClick={() => {
                onPreviewFile(row._id, "tugas");
              }}
            >
              <ListItemAvatar>
                <Tooltip title={row.on_time ? "Terkumpul" : "Terkumpul Telat"}>
                  <Badge
                    overlap="circle"
                    badgeContent={
                      <PublishIcon
                        className={
                          row.on_time
                            ? classes.submittedBadge
                            : classes.submittedLateBadge
                        }
                        fontSize="small"
                      />
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar className={iconStyle}>{fileIcon}</Avatar>
                  </Badge>
                </Tooltip>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Tooltip title={row.name} placement="top">
                    <Typography noWrap>{row.name}</Typography>
                  </Tooltip>
                }
                secondary={fileCategory}
              />
              {isDeletable ? (
                <IconButton
                  size="small"
                  className={classes.deleteTaskButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteDialog(row._id, row.name);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              ) : null}
            </ListItem>
          </Paper>
        </Grid>
      );
    }
    return (
      <Grid item>
        <Paper variant="outlined" className={classes.chosen}>
          <ListItem button>
            <ListItemAvatar>
              <Avatar className={iconStyle}>{fileIcon}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Tooltip title={row.name} placement="top">
                  <Typography noWrap>{row.name}</Typography>
                </Tooltip>
              }
              secondary={fileCategory}
            />
            {isDeletable ? (
              <IconButton
                size="small"
                className={classes.deleteTaskButton}
                onClick={(e) => {
                  handleLampiranDelete(e, idx);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            ) : null}
          </ListItem>
        </Paper>
      </Grid>
    );
  });
}

export default FileSubmission;
