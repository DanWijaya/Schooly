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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <input
        type="file"
        accept="image/*"
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
      <button onClick={() => imageUploader.current.click()}>Click to upload Image</button>
    </div>
  );
}

export default ImageUpload;
