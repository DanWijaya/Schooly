import React, { Component } from "react"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateAvatar } from '../actions/AuthActions';
import { Avatar } from '@material-ui/core';
import defaultAvatar from '../components/layout/profile/DefaultAvatar.jpg'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20)
  }

}))
function ImageUpload(props) {
  const classes = useStyles()
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [profileImg, setProfileImg] = React.useState(null);

  const { user } = props.auth;

  const handleImageUpload = e => {
    const [file] = e.target.files;
    setProfileImg(e.target.files[0])
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = e => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    
  };

  
  const onSubmitForm = (e) => {
    e.preventDefault()
    console.log("AAA")
    let formData = new FormData()
    console.log(profileImg)
    formData.append("avatar", profileImg)


    let userData = user
    let userId = user.id;
    
    props.updateAvatar(userData, userId, formData, props.history)

  } 


  return (
    
     <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      
      <h1 class="my-4"> Unggah/Upload profil foto</h1>
      {/* action={`/api/users/update/${user.id}`} method="post" */}
      <form onSubmit={onSubmitForm}>
      <input
        type="file"
        name="avatar" 
        id="avatar1"
        class="custom-file-input"
        onChange={handleImageUpload}
        ref={imageUploader}
        style={{
          display: "none"
        }}
      />
      <div
        style={{
          height: "160px",
          width: "160px",
          // border: "1px dashed black"
        }}
      >
        <img
          ref={uploadedImage}
          style={{
            width: "160px",
            height: "160px",
          }}
        />
        {/* {user.avatar ? 
          <img ref={uploadedImage}  className={classes.avatar}/> : 
          <Avatar ref={uploadedImage}  className={classes.avatar}/>} */}
      </div>
      <button type="button" onClick={() => {
        imageUploader.current.click()}}>Klik untuk upload</button>

      <input type="submit" value="Submit" class="btn btn-primary btn-block"/>
      </form>
    </div> 
  )
  }

ImageUpload.propTypes = {
  auth: PropTypes.object.isRequired,
  updateAvatar : PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(
    mapStateToProps, {updateAvatar}
) (ImageUpload);
