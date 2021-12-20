import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { getMultipleFileAvatar } from "../../../actions/files/FileAvatarActions";
import DeleteDialog from "../../misc/dialog/DeleteDialog";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import OptionMenu from "../../misc/menu/OptionMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
  },
  commentActionButton: {
    width: "18px",
    height: "18px",
    "&:focus, &:hover": {
      backgroundColor: "#F1F1F1",
    },
  },
  commentActionIcon: {
    fontSize: "18px",
  },
  cancelButton: {
    width: "100px",
    color: theme.palette.text.secondary,
  },
  saveButton: {
    width: "100px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

function Comment(props) {
  //From parent
  const { data } = props;
  const { createComment, editComment, deleteComment } = props.commentMethod;
  const { getData } = props.dataMethod;

  // From redux actions
  const { getMultipleFileAvatar } = props;
  const { user, all_students, all_teachers } = props.auth;
  const [commentValue, setCommentValue] = React.useState("");
  const [commentEditorValue, setCommentEditorValue] = React.useState("");
  const [commentAvatar, setCommentAvatar] = React.useState({});
  const [selectedCommentIdx, setSelectedCommentIdx] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [deleteCommentIdx, setDeleteCommentIdx] = React.useState(null);
  const [commentList, setCommentList] = React.useState([]);

  // Snackbar
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [openCommentSnackbar, setOpenCommentSnackbar] = React.useState(false);

  const deleteDialogHandler = React.useRef(null);
  const classes = useStyles();
  const { comments, _id } = data;
  console.log(all_teachers, all_students);
  React.useEffect(() => {
    if (
      Array.isArray(all_students) &&
      Array.isArray(all_teachers) &&
      comments
    ) {
      setCommentList(getCommentsWithAuthor(comments));
      if (
        selectedCommentIdx !== null &&
        deleteCommentIdx !== null &&
        deleteCommentIdx < selectedCommentIdx
      ) {
        // To move edit textfield.
        setSelectedCommentIdx(selectedCommentIdx - 1);
      }
      setDeleteCommentIdx(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments, all_teachers, all_students]);

  React.useEffect(() => {
    let setId = new Set();
    commentList.map((comment) => {
      setId.add(comment.author_id);
    });
    setId.add(user._id);
    getMultipleFileAvatar(Array.from(setId)).then((results) => {
      setCommentAvatar(results);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentList]);

  function getCommentsWithAuthor(comments) {
    let usernames = {};
    for (let userInfo of [...all_students, ...all_teachers]) {
      usernames[userInfo._id] = userInfo.name;
    }

    return comments.map((comment) => ({
      ...comment,
      authorName: usernames[comment.author_id],
    }));
  }

  //Comment value handler
  const handleInputChange = (e) => {
    setCommentValue(e.target.value);
  };

  const handleEditorChange = (e) => {
    setCommentEditorValue(e.target.value);
  };

  //Snackbar handler
  const handleOpenSnackbar = (severity, content) => {
    setOpenCommentSnackbar(true);
    setSeverity(severity);
    setSnackbarContent(content);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenCommentSnackbar(false);
  };

  // Dialog handler
  const handleOpenDeleteDialog = (e, row) => {
    setOpenDeleteDialog(true);
    deleteDialogHandler.current =
      row._id === selectedCommentIdx
        ? () => {
            handleDeleteComment(row._id);
            closeEditMode();
          }
        : () => {
            handleDeleteComment(row._id);
          };
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  //Comment Selection handler
  const closeEditMode = () => {
    setCommentEditorValue("");
    setSelectedCommentIdx(null);
  };

  const handleSelectedComment = (id) => {
    setCommentEditorValue(commentList[id].content);
    setSelectedCommentIdx(id);
  };

  //comment API handler
  const handleCreateComment = () => {
    console.log("Create comment is runned");
    if (commentValue.length === 0) {
      handleOpenSnackbar("error", "Isi komentar tidak boleh kosong");
    } else {
      createComment(_id, {
        author_id: user._id,
        content: commentValue,
      })
        .then(() => {
          handleOpenSnackbar("success", "Komentar berhasil dibuat");
          setCommentValue("");
          return getData(_id);
        })
        .then((data) => {
          let { comments } = data;
          setCommentList(getCommentsWithAuthor(comments));
        })
        .catch(() => {
          handleOpenSnackbar("error", "Komentar gagal dibuat");
        });
    }
  };

  const handleEditComment = () => {
    if (commentEditorValue.length === 0) {
      handleOpenDeleteDialog(selectedCommentIdx);
    } else {
      editComment(_id, commentEditorValue, commentList[selectedCommentIdx]._id)
        .then(() => {
          handleOpenSnackbar("success", "Komentar berhasil disunting");
          return getData(_id);
        })
        .then((data) => {
          let { comments } = data;
          setCommentList(getCommentsWithAuthor(comments));
        })
        .catch(() => {
          handleOpenSnackbar("error", "Komentar gagal disunting");
        });
      closeEditMode();
    }
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(_id, commentId)
      .then(() => {
        handleOpenSnackbar("success", "Komentar berhasil dihapus");
        return getData(_id);
      })
      .then((data) => {
        let { comments } = data;
        setCommentList(getCommentsWithAuthor(comments));
      })
      .catch(() => {
        handleOpenSnackbar("error", "Komentar gagal dihapus");
      });
    handleCloseDeleteDialog();
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Komentar
      </Typography>
      <Divider style={{ marginBottom: "16px" }} />
      {commentList.length !== 0 ? (
        <>
          <Grid container wrap="nowrap" direction="column" spacing={2}>
            {commentList.map((comment, idx) => {
              const {
                author_id,
                authorName,
                createdAt,
                content,
                edited,
              } = comment;
              const isAuthor = author_id === user._id;
              return (
                <Grid item>
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Avatar src={commentAvatar[author_id]} />
                    </Grid>
                    <Grid item xs zeroMinWidth container>
                      <Grid
                        item
                        xs={12}
                        container
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid item xs>
                          <Typography variant="body2" noWrap gutterBottom>
                            {authorName}{" "}
                            <span style={{ color: "grey" }}>
                              {edited === true ? "(Disunting)" : null} •{" "}
                              {moment(createdAt)
                                .locale("id")
                                .format("DD MMM YYYY, HH.mm")}
                            </span>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        {selectedCommentIdx !== null &&
                        selectedCommentIdx === idx ? (
                          <Grid container direction="column" spacing={1}>
                            <Grid item>
                              <TextField
                                key={idx}
                                fullWidth
                                multiline
                                variant="outlined"
                                onChange={handleEditorChange}
                                value={commentEditorValue}
                              />
                            </Grid>
                            <Grid item container spacing={1}>
                              <Grid item>
                                <Button
                                  className={classes.cancelButton}
                                  startIcon={<CancelIcon />}
                                  onClick={closeEditMode}
                                >
                                  Batal
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  className={classes.saveButton}
                                  startIcon={<CheckCircleIcon />}
                                  onClick={handleEditComment}
                                >
                                  Simpan
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {content}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    {isAuthor &&
                    !(
                      selectedCommentIdx !== null && selectedCommentIdx === idx
                    ) ? (
                      <OptionMenu
                        actions={["Sunting", "Hapus"]}
                        row={comment}
                        handleActionOnClick={[
                          () => handleSelectedComment(idx),
                          handleOpenDeleteDialog,
                        ]}
                      />
                    ) : null}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Divider style={{ margin: "16px 0px" }} />
        </>
      ) : null}
      <Grid container spacing={2}>
        <Grid item>
          <Avatar src={commentAvatar[user._id]} />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            placeholder="Tambahkan komentar..."
            onChange={handleInputChange}
            value={commentValue}
            InputProps={{
              style: {
                borderRadius: "20px",
                padding: "12.5px 0px",
              },
              endAdornment: (
                <InputAdornment position="end" style={{ marginRight: "5px" }}>
                  <LightTooltip title="Kirim">
                    <IconButton size="small" onClick={handleCreateComment}>
                      <SendIcon />
                    </IconButton>
                  </LightTooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        itemType="Komentar"
        deleteItem={deleteDialogHandler.current}
      />
      <Snackbar
        open={openCommentSnackbar}
        autoHideDuration={4000}
        onClose={(event, reason) => handleCloseSnackbar(event, reason)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={(event, reason) => handleCloseSnackbar(event, reason)}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

Comment.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getMultipleFileAvatar,
})(Comment);
