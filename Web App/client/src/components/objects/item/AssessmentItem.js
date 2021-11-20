import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Badge,
  Dialog,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { FaClipboardList } from "react-icons/fa";
import { BsClipboardData } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
  assessmentIcon: {
    backgroundColor: theme.palette.primary.main,
  },
  missingIcon: {
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "white",
    color: theme.palette.error.main,
  },
  completedIcon: {
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "white",
    color: theme.palette.success.main,
  },
}));

function AssessmentItem(props) {
  const classes = useStyles();
  const {
    link,
    type,
    status,
    missing,
    primaryText,
    subPrimaryText,
    secondaryText,
    subSecondaryText,
  } = props;
  const { data, handleOpenDeleteDialog } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentDialogInfo, setCurrentDialogInfo] = React.useState({});

  const handleOpenDialog = (
    title,
    subject,
    teacher_name,
    start_date,
    end_date
  ) => {
    setCurrentDialogInfo({
      title,
      subject,
      teacher_name,
      start_date,
      end_date,
    });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Link to={link}>
        <Paper variant="outlined" className={classes.root}>
          <ListItem
            button
            onClick={() =>
              handleOpenDialog(
                props.title,
                props.subject,
                props.teacher,
                props.startTime,
                props.endtime
              )
            }
          >
            <ListItemAvatar>
              <Badge
                overlap="circle"
                badgeContent={
                  status === missing ? (
                    <ErrorIcon className={classes.missingIcon} />
                  ) : (
                    <CheckCircleIcon className={classes.completedIcon} />
                  )
                }
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar className={classes.assessmentIcon}>
                  {type === "Kuis" ? <FaClipboardList /> : <BsClipboardData />}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography noWrap>{primaryText}</Typography>}
              secondary={
                <Typography variant="body2" color="textSecondary" noWrap>
                  {subPrimaryText}
                </Typography>
              }
            />
            <ListItemText
              align="right"
              primary={
                <Typography variant="body2" color="textSecondary" noWrap>
                  {secondaryText}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="textSecondary" noWrap>
                  {subSecondaryText}
                </Typography>
              }
            />
          </ListItem>
        </Paper>
      </Link>
      <Dialog
        fullWidth
        fullScreen={false}
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <div style={{ padding: "20px" }}>
          <Typography variant="h4" align="center">
            {currentDialogInfo.title}
          </Typography>
          <Typography variant="h5" align="center" color="primary">
            {currentDialogInfo.subject}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            style={{ marginTop: "25px" }}
          >
            Guru: {currentDialogInfo.teacher_name}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Mulai: {currentDialogInfo.start_date}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Selesai: {currentDialogInfo.end_date}
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            color="textSecondary"
            style={{ marginTop: "10px", textAlign: "center" }}
          >
            Tautan untuk Kuis atau Ujian anda akan diberikan oleh guru mata
            pelajaran terkait.
          </Typography>
        </div>
      </Dialog>
    </div>
  );
}

export default AssessmentItem;
