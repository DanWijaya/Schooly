import React, { useState, useEffect, useCallback  } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dropbox } from "dropbox";
import { tokenUrl } from "../../utils/getDropboxToken";
import PropTypes from "prop-types";
import { setDropboxToken } from "../../actions/UserActions";
import FileList from "./filelist/FileList.js";
import CustomizedMenu from "./CustomizedMenu.js";
import LightTooltip from "../misc/light-tooltip/LightTooltip";
import CreateFolder from "./dialog/CreateFolder";
import "./DropboxConnect.css";
import { Breadcrumbs, Button, CircularProgress, Grid, InputAdornment, IconButton, Snackbar, TextField, Typography } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { FaDropbox, FaFolderPlus, FaFileUpload } from "react-icons/fa";
import { GoSearch } from "react-icons/go";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  dropboxLogo: {
    color: theme.palette.dropbox.main,
    width: "50px",
    height: "50px",
    [theme.breakpoints.up("sm")]: {
      width: "75px",
      height: "75px",
    },
  },
  connectButton: {
    maxWidth: "300px",
    backgroundColor: theme.palette.dropbox.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.dropbox.main,
      color: "white",
    },
  },
  closeButton: {
    color: theme.palette.error.main,
    "&:focus, &:hover": {
      color: theme.palette.error.dark,
    },
  },
  moreIcon: {
    opacity: "50%",
    "&:focus, &:hover": {
      opacity: "100%",
      color: theme.palette.primary.main,
    },
  },
  searchButton: {
    color: theme.palette.primary.main,
    "&:focus, &:hover": {
      color: theme.palette.primary.dark,
    },
  },
  viewDirectory: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Franklin Gothic",
  },
  viewDirectoryPath: {
    fontFamily: "Franklin Gothic",
    cursor: "pointer",
  },
  homeDirectoryIcon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  actionIcon: {
    color: theme.palette.dropbox.main,
    display: "flex",
    alignItems:"center",
  },
  loadingAlert: {
    backgroundColor: theme.palette.primary.main
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ViewDirectory (props) {
  // Hooks only allowed to be used inside a component.
  const classes = useStyles();
  const {handleUpdatePath, path} = props;
  let folders_name = path.split("/")
  let traverse_dir = "";
  let dir_list = [];

  for (var i = 1; i < folders_name.length; i++) {
    traverse_dir += `/${folders_name[i]}`
    dir_list.push(traverse_dir)
  }

  return (
    <Breadcrumbs
      component="div"
      separator={<NavigateNextIcon fontSize="small" />}
      className={classes.viewDirectory}
    >
      <div onClick={() => handleUpdatePath("")} style={{display: "flex"}}>
        <HomeIcon color={path ? "textPrimary" : "primary"} className={classes.homeDirectoryIcon}/>
        <Typography color={path ? "textPrimary" : "primary"} className={classes.viewDirectoryPath}>
          Dropbox
        </Typography>
      </div>
      {folders_name.map((name,i) => {
        if (i !== 0) {
          return(
            <Grid item onClick={() => handleUpdatePath(dir_list[i-1])}>
              <Typography color={ i === folders_name.length - 1 ? "primary" : "textPrimary"} className={classes.viewDirectoryPath}>
                {name}
              </Typography>
            </Grid>
          )
        }
      return null
      })
      }
    </Breadcrumbs>
  );
}

function DropboxConnect(props) {
  const classes = useStyles();
  // const [documents, updateDocs] = useState([]);
  // const [choosenFiles, updateChoosenFiles] = useState([]);
  // const [dropDown, updateDropDown] = useState(false);
  const [createFolderDialog, setCreateFolderDialog] = useState(false);
  const [searchFilter, updateSearchFilter ] = useState("");
  const [allDocs, updateAllDocs] = useState([]);

  const [newFileToRender, setNewFileToRender] = useState(false);
  const [path, updatePath] = useState("");
  const [userName, updateUserName] = useState("");
  const fileUploader = React.useRef(null);
  const [openLoadingAlert, setOpenLoadingAlert] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("");
  const [openSuccessAlert, setOpenSuccessAlert] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("")

  const { setDropboxToken } = props;
  const { dropbox_token } = props.auth;
  const [page, setPage] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickAction = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorEl(null);
  };


  const handleOpenLoadingAlert = useCallback(() => {
    setOpenLoadingAlert(true)
    setOpenSuccessAlert(false)
  },[])

  const handleCloseLoadingAlert = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenLoadingAlert(false);
  },[]);

  const handleOpenSuccessAlert = useCallback(() => {
    handleCloseLoadingAlert()
    setOpenSuccessAlert(true);
    setNewFileToRender(false)
  },[handleCloseLoadingAlert])

  const handleCloseSuccessAlert = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessAlert(false);
  },[])

  useEffect(() => {
    if(dropbox_token){
      let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
      dropbox
        .usersGetCurrentAccount()
        .then(function (response) {
          updateUserName(response.email);
        })
        .catch(function (error) {
            console.error(error);
        });
    }
    // eslint-disable-next-line
  }, [dropbox_token]);

  // Ini untuk handle pas awal" connect ke Dropbox.
  useEffect(() => {
      let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
      dropbox
        .filesListFolder({ path: path })
        .then((response) => {
          console.log("resonse.entries", response.entries);
          updateAllDocs(response.entries);
          if(newFileToRender){
            setNewFileToRender(false)
            handleOpenSuccessAlert()
          }
        })
        .catch((response) => {
          console.log(response.error.error_summary);
        });
        // eslint-disable-next-line
  }, [dropbox_token, newFileToRender])

// Ini untuk handle kalo pathnya berubah berubah
  useEffect(() => {
    let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
    dropbox
      .filesListFolder({ path: path })
      .then((response) => {
        console.log("resonse.entries", response.entries);
        updateAllDocs(response.entries);
        updateSearchFilter("") // ini untuk clear search filter tiap kali ganti directory
        setPage(0)
      })
      .catch((response) => {
        console.log(response.error.error_summary);
      });

  }, [dropbox_token, path])

  // Ini untuk hand;e Search filter
  useEffect(() => {
    let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
    dropbox
      .filesListFolder({ path: path })
      .then((response) => {
        console.log("resonse.entries", response.entries);
        updateAllDocs(response.entries); // ini untuk clear search filter tiap kali ganti directory
        setPage(0)
      })
      .catch((response) => {
        console.log(response.error.error_summary);
      });

  }, [searchFilter, dropbox_token, path])

  const handleUpdatePath = useCallback((path) => {
    updatePath(path)
  },[])

  const getLinkToFile = useCallback((path) => {
    // console.log(path);
    let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });

    dropbox
      .filesGetTemporaryLink({ path: path})
      .then((response) => {
        window.location.href = response.link
      })
      .catch((error) => {
        console.error(error, "Error by downloading file");
      })
  },[dropbox_token]);

  const onChange = (e) => {
    switch(e.target.id){
      case "searchFilter":
        console.log(e.target.value)
        updateSearchFilter(e.target.value)
        break;

      default:
        break;
    }
  }


  const handleCloseDropbox = () => {
    console.log("AA")
    console.log(localStorage.dropbox_token)
    setDropboxToken(null)
  }

  const menuItemList = [
    {
      icon: <FaFileUpload style={{marginRight: "10px"}}/>,
      text: "Unggah File",
      handleClick: function(){
        fileUploader.current.click()
        handleCloseAction()
      }
    },
    {
      icon: <FaFolderPlus style={{marginRight: "10px"}}/> ,
      text: "Buat Folder",
      handleClick: function(){
        setCreateFolderDialog(true)
        handleCloseAction()
      }
    },
  ]

  const uploadFiles = (e) => {
    // const UPLOAD_FILE_SIZE_LIMIT = 100 * 1024 * 1024;
    let dropBox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
    let files = Array.from(e.target.files);
    console.log(files)
    if (files.length === 0) {
      return;
    }

    // if (files.some(file => file.size > UPLOAD_FILE_SIZE_LIMIT)) {
    //   alert("Salah satu file memiliki ukuran melebihi batas (100MB)!");
    // }

    setLoadingMessage("File sedang diunggah, mohon tetap menunggu")
    handleOpenLoadingAlert()
    const promises = files.map(file =>
      dropBox.filesUpload({
        path: path + "/" + file.name,
        contents: file,
      })
    );

    Promise.all(promises)
      .then(responses => {
        console.log("promiseAll response", responses);
        setNewFileToRender(true)
        setSuccessMessage("File berhasil diunggah")
        // handle success alertnya di useEffect render files.
      })
      .catch(err => {
        console.error(err);
      });
  };

  document.title = "Schooly | Hubungkan ke Dropbox";
  if (dropbox_token) {
    return(
      <div className={classes.root}>
      <Snackbar open={openLoadingAlert} anchorOrigin={{vertical: 'top', horizontal: 'top' }} autoHideDuration={null} onClose={handleCloseLoadingAlert}>
        <Alert className={classes.loadingAlert} icon={<CircularProgress disableShrink size={22} color="inherit" />} >
          {loadingMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccessAlert} anchorOrigin={{vertical: 'top', horizontal: 'top' }} autoHideDuration={3000} onClose={handleCloseSuccessAlert}>
        <Alert onClose={handleCloseSuccessAlert} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
        <CreateFolder
          setLoadingMessage={setLoadingMessage}
          setSuccessMessage={setSuccessMessage}
          handleOpenLoadingAlert={handleOpenLoadingAlert}
          path={path}
          newFolder = {newFileToRender}
          open={createFolderDialog}
          renderToUpdate={setNewFileToRender}
          handleOpen={setCreateFolderDialog}
        />
        <Grid container>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <FaDropbox className={classes.dropboxLogo} />
            </Grid>
            <Grid item>
              <Typography variant="h3" style={{fontFamily: "Franklin Gothic"}}>
                Dropbox
              </Typography>
              <Typography color="textSecondary">
                {userName}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="space-between" alignItems="center" style={{marginTop: "20px", marginBottom: "7.5px"}}>
          <Grid item xs={12} md={6}>
            <ViewDirectory path={path} handleUpdatePath={handleUpdatePath}/>
          </Grid>
          <Grid item xs={10} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="searchFilter"
              value={searchFilter}
              onChange={onChange}
              InputProps={{
                endAdornment:
                  <InputAdornment position="start">
                    <IconButton size="small" className={classes.searchButton}>
                      <GoSearch />
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </Grid>
          <Grid item>
            <IconButton  onClick={handleClickAction} className={classes.moreIcon}>
              <MoreHorizIcon/>
            </IconButton>
            <CustomizedMenu
              menuItemList={menuItemList}
              handleClose={handleCloseAction}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}/>
              <input
                style={{ display: "none" }}
                multiple
                ref={fileUploader}
                onChange={uploadFiles}
                type="file"
              />
            <LightTooltip title="Matikan Dropbox">
              <IconButton onClick={handleCloseDropbox} className={classes.closeButton}>
                <ExitToAppIcon />
              </IconButton>
            </LightTooltip>
          </Grid>
        </Grid>
        <FileList
          page={page}
          setPage={setPage}
          renderToUpdate={setNewFileToRender}
          searchFilter={searchFilter}
          allDocs={allDocs}
          path={path}
          updatePath={handleUpdatePath}
          getLinkToFile={getLinkToFile}
          handleOpenLoadingAlert={handleOpenLoadingAlert}
          handleOpenSuccessAlert={handleOpenSuccessAlert}
          setSuccessMessage={setSuccessMessage}
          setLoadingMessage={setLoadingMessage}/>
      </div>
    )
  }
  else {
    return (
      <div className={classes.root}>
        <Grid container direction="column" spacing={5} alignItems="center">
          <Grid item container spacing={3} alignItems="center">
            <Grid item>
              <FaDropbox className={classes.dropboxLogo} />
            </Grid>
            <Grid item>
              <Typography variant="h3" style={{fontFamily: "Franklin Gothic"}}>
                Dropbox
              </Typography>
              <Typography color="error">
                Belum Terhubung
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="column" spacing={2} alignItems="center">
            <Grid item>
              <Typography align="center" gutterBottom>
                Hubungkan ke akun Dropbox Anda ke Schooly untuk mengakses, menggunggah dan mengunduh berkas yang ada di Schooly.
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                Dengan menghubungkan akun Dropbox Anda ke Schooly, Anda telah menyetujui <a href="https://www.dropbox.com/terms">
                Kebijakan Penggunan Dropbox</a> dan <Link to="/kebijakan-penggunaan">Kebijakan Penggunaan Schooly</Link> untuk penggunaan aplikasi pihak ketiga di Schooly.
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                href={tokenUrl}
                className={classes.connectButton}
              >
                Hubungkan Dropbox
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
};

DropboxConnect.propTypes = {
  setDropboxToken: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
})

export default connect(
  mapStateToProps, { setDropboxToken }
)(DropboxConnect);
