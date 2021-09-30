import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "15px",
    },
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
      backgroundColor: theme.palette.success.dark
    },
  },
}));

function Comment(props) {
  const [commentValue, setCommentValue] = React.useState("");
  const [commentEditorValue, setCommentEditorValue] = React.useState("");
  const [commentList, setCommentList] = React.useState([]);
  const [commentAvatar, setCommentAvatar] = React.useState({});
  const [selectedCommentIdx, setSelectedCommentIdx] = React.useState(null);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = React.useState(null);
  const [deleteCommentIdx, setDeleteCommentIdx] = React.useState(null);
  const deleteDialogHandler = React.useRef(null);

  const generateComments = (author_id, authorName, date, comment, isSelfMade, idx, edited) => {
    return (
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar src={commentAvatar[author_id]} />
        </Grid>
        <Grid item xs zeroMinWidth container>
          <Grid item xs={12}>
            <Typography variant="body2" noWrap>
              {authorName} <span style={{ color: "grey" }}>
              {edited === true ? "(Disunting)" : null} • {moment(date)
              .locale("id").format("DD MMM YYYY, HH.mm")}</span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
          {(selectedCommentIdx !== null && selectedCommentIdx === idx) ?
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  onChange={handleCommentEditorChange}
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
          :
            <Typography align="justify" style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
              {comment}
            </Typography>
          }
          </Grid>
        </Grid>
        {(isSelfMade && !(selectedCommentIdx !== null && selectedCommentIdx === idx)) ?
          <Grid item>
            <LightTooltip title="Sunting">
              <CreateIcon
                style={{marginRight: "2px"}}
                className={classes.commentLittleIcon}
                fontSize="small"
                onClick={() => handleClickEdit(idx)}
              />
            </LightTooltip>
            <LightTooltip title="Hapus">
              <DeleteIcon
                className={classes.commentLittleIcon}
                fontSize="small"
                onClick={() => handleOpenDeleteCommentDialog(idx)}
              />
            </LightTooltip>
          </Grid>
        : null}
      </Grid>
    );
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Komentar Kelas
      </Typography>
      <Divider />
      {(commentList.length !== 0) ?
          <div style={{ padding: "16px 0px" }}>
            <Grid container wrap="nowrap" direction="column" spacing={2}>
              {commentList.map((comment, idx) => (
                  <Grid item>
                    {generateComments(comment.author_id, comment.name, comment.createdAt, comment.content, comment.author_id === user._id, idx, comment.edited)}
                  </Grid>
                ))
              }
            </Grid>
            <Divider style={{ marginTop: "16px" }} />
          </div>
        : null
      }
      <Grid container spacing={2}>
        <Grid item>
          <Avatar src={commentAvatar[user._id]}/>
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            placeholder="Tambahkan komentar..."
            onChange={handleCommentInputChange}
            value={commentValue}
            InputProps={{
              style: {
                borderRadius: "20px",
                padding: "12.5px 0px"
               },
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ marginRight: "5px" }}
                >
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
    </Paper>
  );
};

export default Comment;
