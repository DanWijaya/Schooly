import React, { useState, useRef, useEffect  } from "react";
// import { tokenUrl } from "../getToken";
import { tokenUrl } from "../../utils/getDropboxToken"
import { Redirect } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Dropbox } from "dropbox";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { GoSearch } from 'react-icons/go';
import { FaAngleRight, FaHome } from "react-icons/fa";
import { Grid, InputAdornment, IconButton, TextField, Typography, Button } from "@material-ui/core";
import { setDropboxToken } from "../../actions/UserActions"
import FileList from "./filelist/FileList"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  listItem: {
    padding: "10px 20px 10px 20px",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  createButton: {
    backgroundColor: "#61BD4F",
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: "#61BD4F",
    },
  },
  menuItem: {
    "&:hover": {
      backgroundColor: "#61BD4F",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
  containerLogin: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "relative",
  },
  closeButton: {
    width: "100%",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
}));

function DropboxConnect(props) {
  const classes = useStyles();
  const [documents, updateDocs] = useState([]);
  const [choosenFiles, updateChoosenFiles] = useState([]);
  const [search, updateSearch] = useState('');
  const [userName, updateUserName] = useState("");
  const [dropDown, updateDropDown] = useState(false);
  const [searchFilter, setSearchFilter ] = useState("");
  const [allDocs, setallDocs] = useState([]);
  const nodeDropdown = useRef();

  const { setDropboxToken } = props;
  const { dropbox_token } = props.auth;

// this is for getting the users.
// this is for getting the files.
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

      dropbox
        .filesListFolder({ path: '' }).then((response) => {
          console.log('resonse.entries', response.entries);
          setallDocs(response.entries);
        }).catch((err) => {
          console.log("Terjadi error")
        });
    }
    // eslint-disable-next-line
}, [dropbox_token]);


const onChange = (e) => {
  switch(e.target.id){
    case "searchFilter":
      setSearchFilter(e.target.value)

    default:
      break;
  }
}

const handleCloseDropbox = () => {
  console.log("AA")
  console.log(localStorage.dropbox_token)
  setDropboxToken(null)
}


  if(dropbox_token){
    // let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
    console.log(searchFilter)
    console.log(allDocs)

    const showFiles = () => {
      allDocs.map(doc =>
        <FileList
        key={doc.id}
        doc={doc}
        // getLinkToFile={getLinkToFile}
        // favorites={favorites}
        // location={location}
        documents={allDocs}
        // localToken={localToken}
        />
      )
      return allDocs
    }

    return(
      <div className={classes.root}>
        <Typography variant="h5" align="center">Akun Dropbox {userName}</Typography>
          <Grid container spacing={5} alignItems="center" style={{paddingTop: "20px"}}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                variant="outlined"
                id="searchFilter"
                InputProps={{
                  endAdornment:
                    <InputAdornment position="start">
                      <IconButton size="small">
                        <GoSearch style={{color:"#2196f3"}}/>
                      </IconButton>
                    </InputAdornment>
                }}
                value={searchFilter}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Button startIcon onClick={handleCloseDropbox} className={classes.closeButton}>
                <b>Tutup Dropbox</b>
              </Button>
            </Grid>
          </Grid>


      </div>
    )



  }







  else {
    return (
      <div className={classes.root}>
        <Typography variant="h4" align="center">
          Dropbox Anda
        </Typography>
        <p> Dropbox anda belum terhubung ke sistem Schooly</p>
         <a href={tokenUrl}>Hubungkan ke Dropbox</a>
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
