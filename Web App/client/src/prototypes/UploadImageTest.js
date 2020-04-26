import React, { Component } from "react"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {updateUser} from '../actions/AuthActions';

function ImageUpload(props) {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const { user } = props.auth;
  const handleImageUpload = e => {
    const [file] = e.target.files;
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

  const updateAvatar = () => {
    let userData = user;
    let userId = user.id;

    props.updateUser(userData, userId, props.history)
  } 

  // const uploadImage = () => {

  // }

  return (
    
     <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h1 class="my-4"> Upload your Avatar</h1>
      <form action={`/api/uploads/upload/${user.id}`} method="post" encType="multipart/form-data">
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
          border: "1px dashed black"
        }}
      >
        <img
          ref={uploadedImage}
          style={{
            width: "160px",
            height: "160px",
          }}
        />
      </div>
      <button type="button" onClick={() => {
        imageUploader.current.click()}}>Click to upload Image</button>

      <input type="submit" onSubmit={updateAvatar} value="Submit" class="btn btn-primary btn-block"/>
      </form>
    </div> 
  )
  }

ImageUpload.propTypes = {
  auth: PropTypes.object.isRequired,
  updateUser : PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(
    mapStateToProps, {updateUser}
) (ImageUpload);
