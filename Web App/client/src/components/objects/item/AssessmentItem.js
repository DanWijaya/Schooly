import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import OptionMenu from "../../misc/menu/OptionMenu";
import {
  Avatar,
  Badge,
  Dialog,
  DialogContent,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Snackbar,
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
    data,
    handleOpenDeleteDialog,
    status,
    missing,
    handleOpenCopySnackBar,
  } = props;
  const { user, all_roles } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentDialogInfo, setCurrentDialogInfo] = React.useState({});

  const handleCopyLink = async (e, row) => {
    e.stopPropagation();
    try {
      if (!navigator.clipboard) {
        // use old commandExec() way.
        let textArea = document.createElement("textarea");
        textArea.value = row.linkToShare;
        document.body.appendChild(textArea.value);
        textArea.select();
        document.execCommand("copy");
      } else {
        await navigator.clipboard.writeText(row.linkToShare);
      }
      handleOpenCopySnackBar(row.type);
    } catch (err) {
      console.error(err);
      console.error("Error in copying link");
    }
  };

  const handleOpenDialog = (row) => {
    setCurrentDialogInfo(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {data.map((row) => {
        const type = row.type.toLowerCase();
        const viewPage = `/${type}-guru/${row._id}`;
        const linkToShare = `${window.location.host}/${type}-murid/${row._id}`;
        row.linkToShare = linkToShare;

        if (user.role === all_roles.TEACHER) {
          return (
            <Grid item>
              <Link to={viewPage}>
                <Paper variant="outlined" className={classes.root}>
                  <ListItem button disableRipple>
                    <ListItemAvatar>
                      <Badge
                        overlap="circle"
                        badgeContent={
                          status === missing ? (
                            <ErrorIcon className={classes.missingIcon} />
                          ) : (
                            <CheckCircleIcon
                              className={classes.completedIcon}
                            />
                          )
                        }
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                      >
                        <Avatar className={classes.assessmentIcon}>
                          {row.type === "Kuis" ? (
                            <FaClipboardList />
                          ) : (
                            <BsClipboardData />
                          )}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography noWrap>
                          {row.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          noWrap
                        >
                          {all_subjects_map.get(row.subject)}
                        </Typography>
                      }
                    />
                    <ListItemText
                      align="right"
                      primary={
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          noWrap
                        >
                          {moment(row.start_date)
                            .locale("id")
                            .format("DD MMM YYYY")}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          noWrap
                        >
                          {moment(row.start_date).locale("id").format("HH.mm")}
                        </Typography>
                      }
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <OptionMenu
                        actions={["Salin Tautan", "Sunting", "Hapus"]}
                        row={row}
                        handleActionOnClick={[
                          handleCopyLink,
                          `/sunting-${row.type}/${row._id}`,
                          handleOpenDeleteDialog,
                        ]}
                      />
                    </div>
                  </ListItem>
                </Paper>
              </Link>
            </Grid>
          );
        } else if (user.role === all_roles.STUDENT) {
          return (
            <Grid item>
              <Paper
                variant="outlined"
                className={classes.root}
                onClick={() => handleOpenDialog(row)}
              >
                <ListItem button disableRipple>
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
                        {row.type === "Kuis" ? (
                          <FaClipboardList />
                        ) : (
                          <BsClipboardData />
                        )}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography noWrap>
                        {row.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {all_subjects_map.get(row.subject)}
                      </Typography>
                    }
                  />
                  <ListItemText
                    align="right"
                    primary={
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {moment(row.start_date)
                          .locale("id")
                          .format("DD MMM YYYY")}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {moment(row.start_date).locale("id").format("HH.mm")}
                      </Typography>
                    }
                  />
                </ListItem>
              </Paper>
            </Grid>
          );
        }
        return;
      })}
      <Dialog
        fullWidth
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogContent>
          <Typography variant="h4" align="center" style={{ marginBottom: "5px" }}>
            {currentDialogInfo.name}
          </Typography>
          <Typography color="primary" align="center">
            {currentDialogInfo.type} {all_subjects_map.get(currentDialogInfo.subject)}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            Oleh: {currentDialogInfo.teacher_name}
          </Typography>
          <div style={{ marginTop: "25px" }}>
            <Typography align="center">
              Mulai - {moment(currentDialogInfo.start_date)
                .locale("id")
                .format("DD/MM/yyyy, HH:mm")}
            </Typography>
            <Typography align="center">
              Selesai - {moment(currentDialogInfo.end_date)
                .locale("id")
                .format("DD/MM/yyyy, HH:mm")}
            </Typography>
          </div>
          <div style={{ marginTop: "10px" }}>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
            >
              Tautan untuk Kuis atau Ujian anda akan diberikan oleh guru terkait.
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              paragraph
            >
              Hasil Kuis atau Ujian akan keluar setelah hasil semua peserta sudah diperiksa.
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

AssessmentItem.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {})(AssessmentItem);
