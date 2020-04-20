import React, { Component } from "react"

function ImageUpload() {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

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

  return (

    <div class="container">
        <div class="row">
            <div class="col-md-6 m-auto">
                <h1 class="my-4">Lets upload some stuff</h1>
                <form action="/upload" method="post" enctype="multipart/form-data">
                    <div class="custom-file mb-3">
                        <input type="file" class="custom-file-input" name="avatar" id="avatar1" onchange="readSingleFile(this.files)"/>
                        <label class="custom-file-label" for="file1" id="file-label">Choose file</label>
                    </div>
                    <input type="submit" value="Submit" class="btn btn-primary btn-block"/>
                </form>
            </div>
        </div>
    </div>
    
    /*  <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "center",
    //     justifyContent: "center"
    //   }}
    // >
    //   <input
    //     type="file"
    //     accept="image/*"
    //     onChange={handleImageUpload}
    //     ref={imageUploader}
    //     style={{
    //       display: "none"
    //     }}
    //   />
    //   <div
    //     style={{
    //       height: "160px",
    //       width: "160px",
    //       border: "1px dashed black"
    //     }}
    //   >
    //     <img
    //       ref={uploadedImage}
    //       style={{
    //         width: "160px",
    //         height: "160px",
    //       }}
    //     />
    //   </div>
    //   <button onClick={() => imageUploader.current.click()}>Click to upload Image</button>
    // </div> */
  )
  }
export default ImageUpload;
