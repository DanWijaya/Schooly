import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Badge,
  Dialog,
  Grid,
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
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/id";
import OptionMenu from "../../misc/menu/OptionMenu";

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

  const { user, all_roles } = props.auth;
  const { all_subjects_map } = props.subjectsCollection;
  const {
    data,
    handleOpenDeleteDialog,
    status,
    missing,
    handleCopyLink,
  } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentDialogInfo, setCurrentDialogInfo] = React.useState({});

  const handleOpenDialog = (row) => {
    // const { name, subject, teacher_name, start_date, end_date } = row;
    setCurrentDialogInfo(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      {data.map((row) => {
        const viewPage = `/${row.type}-guru/${row._id}`;
        const linkToShare = `/${row.type}-murid/${row._id}`;
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
                      primary={<Typography noWrap>{row.name}</Typography>}
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
            <Paper
              variant="outlined"
              className={classes.root}
              onClick={() => handleOpenDialog(row)}
            >
              <ListItem button>
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
                  primary={<Typography noWrap>{row.name}</Typography>}
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
          );
        }
        return;
      })}
      <Dialog
        fullWidth
        fullScreen={false}
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <div style={{ padding: "20px" }}>
          <Typography variant="h4" align="center">
            {currentDialogInfo.name}
          </Typography>
          <Typography variant="h5" align="center" color="primary">
            {all_subjects_map.get(currentDialogInfo.subject)}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            style={{ marginTop: "25px" }}
          >
            Guru: {currentDialogInfo.teacher_name}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Mulai:{" "}
            {moment(currentDialogInfo.start_date)
              .locale("id")
              .format("DD/MM/yyyy - HH:mm")}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Selesai:{" "}
            {moment(currentDialogInfo.end_date)
              .locale("id")
              .format("DD/MM/yyyy - HH:mm")}
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
    </Grid>
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
