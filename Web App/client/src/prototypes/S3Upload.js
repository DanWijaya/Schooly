import React, { Component } from "react";
import axios from "axios";

// import { Card, CardHeader, CardText, CardBody, Row, Col } from "react-strap";

const endpoint = "api/files/material/upload";

class S3Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      selectedFile: null
    };
  }

  handleSelectedFile = e => {
    e.preventDefault();
    this.setState({
      description: e.target.value,
      selectedFile: e.target.files
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleUpload = event => {
    event.preventDefault();
    let data = new FormData();
    const { selectedFile } = this.state
    for(var i=0; i < selectedFile.length; i++){
      data.append("file", selectedFile[i])
    }

    axios
      .post(endpoint, data)
      .then(() => {
        // this.props.history.push("/");
        console.log(data)
      })
      .catch(error => {
        console.log(error)
        alert("Oops some error happened, please try again");
      });
  };

  render() {
    const { description, selectedFile } = this.state;

    return (
      <div>
                  <form onSubmit={this.handleUpload}>
                    <div className="form-group">
                      <label htmlFor="description">Description:</label>
                      <input
                        type="text"
                        class="form-control"
                        name="description"
                        onChange={this.onChange}
                        placeholder="Description"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        multiple
                        type="file"
                        name=""
                        id=""
                        onChange={this.handleSelectedFile}
                      />
                    </div>
                    <button type="submit" class="btn btn-primary">
                      Upload
                    </button>
                  </form>
      </div>
    );
  }
}

export default S3Upload;