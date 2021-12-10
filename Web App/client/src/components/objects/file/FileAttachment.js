import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Paper,
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
import { Delete as DeleteIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
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

function FileAttachment(props) {
  const classes = useStyles();
  const { data, onPreviewFile, handleLampiranDelete } = props;

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

  const isPreviewable = Boolean(onPreviewFile);

  return data.map((row, idx) => {
    if (row.filename) {
      // This code is needed DB Schema is filename not name (Change to name in the future)
      row.name = row.filename;
    }
    const [fileCategory, fileIcon, iconStyle] = fileType(row.name);
    if (isPreviewable) {
      return (
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" className={classes.root}>
            <ListItem
              button
              onClick={() => {
                onPreviewFile(row._id, fileCategory);
              }}
              disableRipple
            >
              <ListItemAvatar>
                <Avatar className={iconStyle}>{fileIcon}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography noWrap>{row.name}</Typography>}
                secondary={
                  <Typography color="textSecondary" noWrap>
                    {fileCategory}
                  </Typography>
                }
              />
            </ListItem>
          </Paper>
        </Grid>
      );
    }

    return (
      <Grid item xs={12}>
        <Paper variant="outlined" className={classes.root}>
          <ListItem disableRipple>
            <ListItemAvatar>
              <Avatar className={iconStyle}>{fileIcon}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography noWrap>{row.name}</Typography>}
              secondary={
                <Typography color="textSecondary" noWrap>
                  {fileCategory}
                </Typography>
              }
            />
            <LightTooltip title="Hapus Lampiran">
              <IconButton
                size="small"
                className={classes.deleteIconButton}
                onClick={(e) => {
                  handleLampiranDelete(e, idx);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </LightTooltip>
          </ListItem>
        </Paper>
      </Grid>
    );
  });
}

export default FileAttachment;
