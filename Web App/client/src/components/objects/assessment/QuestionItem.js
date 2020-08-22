import React, {Component} from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import ClearIcon from "@material-ui/icons/Clear";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import SaveIcon from "@material-ui/icons/Save";
import { withStyles } from "@material-ui/core/styles";
import { Avatar, Badge, Button, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Grid, GridList, GridListTile, GridListTileBar, MenuItem, IconButton, Paper, Radio, RadioGroup, TextField, Typography, Select } from "@material-ui/core";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";

const styles = (theme) => ({
  content: {
    padding: "20px 20px 30px 20px",
  },
  addOptionButton: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    marginTop: "20px",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
});

class QuestionItem extends Component {

  constructor(){
    super();

    this.state = {
      name: "",
      options: ["Opsi 1", ""],
      answer: "A",
      images: []
    }
  }

  isDifferent(arr1, arr2){
    if(!Array.isArray(arr2))
      return false

    if(arr1.length !== arr2.length)
      return true
    
    else{
      for(var i = 0; i < arr1.length; i++){
        if(arr1[i] !== arr2[i].length)
          return true
      }
    }

    return false
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   // console.log([...nextState.options])
  //   console.log(this.state.options)
  //   console.log(nextState.options)
  //   console.log(JSON.stringify(this.state.options) !== JSON.stringify(nextState.options))
  //   // return ( 
  //   //   JSON.stringify(this.state) !== JSON.stringify(nextState) || 
  //   //   JSON.stringify([...this.state.options]) !== JSON.stringify([...nextState.options]) ||
  //   //   JSON.stringify([...this.state.images]) !== JSON.stringify([...nextState.images])
  //   //   )
  // }
  // shouldComponentUpdate(nextProps, nextState){
  //   // return (
  //   //   JSON.stringify(this.state) !== JSON.stringify(nextState)
  //   // )
  // }

  handleChangeQuestion(e, otherfield){
    if(otherfield === "answer"){
      console.log(e.target.value)
      console.log("ASAS")
      this.setState({ answer: e.target.value})
    }
    else{
      this.setState({ [e.target.id]: e.target.value})
    }
  }

  handleQuestionOptions = (e, optionIndex, action) => {
    console.log("handle question options is runned")
    let options = this.state.options;
    if(action === "Delete"){
      options.splice(optionIndex, 1)
    }else if(action === "Add"){
      options.push("")
    }else if(action === "Edit"){
      options[optionIndex] = e.target.value
    }else {
      console.log("No action is specified")
    }

    this.setState({ options: options})
  }

  render(){
    const { classes, number, deleteQuestion } = this.props;

    return (
      <Grid item>
          <Paper>
            <Grid container>
              <Grid item xs sm md container direction="column" spacing={2} className={classes.content}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    Soal {number}
                  </Typography>
                  {/* <GridList cellHeight={400} style={{margin: "10px 0px 10px 0px"}}>
                    {this.buildImgTag(images)}
                  </GridList> */}
                  <TextField
                    multiline
                    rowsMax={10}
                    id="name"
                    fullWidth
                    variant="filled"
                    value={this.state.name}
                    onChange={(e) => this.handleChangeQuestion(e)}
                  />
                </Grid>
                <Grid item>
                  <FormControl component="fieldset" id="answer" fullWidth>
                    <RadioGroup value={this.state.answer.toUpperCase()} id="answer" onChange={(e) => this.handleChangeQuestion(e, "answer")}>
                      {this.state.options.map((option, index) =>
                        <div style={{display: "flex"}}>
                          {/*{console.log(question.answer.toUpperCase() === String.fromCharCode(97 + index).toUpperCase())}
                          <Radio
                            checked={question.answer.toUpperCase() === String.fromCharCode(97 + index).toUpperCase()}
                            value={String.fromCharCode(97 + index).toUpperCase()}
                            onChange={(e) => {console.log("AAA"); this.handleChangeQuestion(e, i, "answer")}}
                          />
                          <TextField
                            fullWidth
                            value={option}
                            onChange={(e) => this.handleQuestionOptions(e, index, i, "Edit" )}
                            placeholder="Isi Pilihan"
                          />*/}
                          <FormControlLabel
                            style={{width: "100%"}}
                            value={String.fromCharCode(97 + index).toUpperCase()}
                            control={<Radio color="primary" />}
                            label={
                              <TextField
                                style={{flexGrow: 1}}
                                value={option}
                                onChange={(e) => this.handleQuestionOptions(e, index, "Edit" )}
                                placeholder="Isi Pilihan"
                              />
                            }
                          />
                          <IconButton onClick={(e) => this.handleQuestionOptions(e, index, "Delete" )}>
                            <ClearIcon/>
                          </IconButton>
                        </div>
                      )}
                      <div>
                        <Button className={classes.addOptionButton} startIcon={<AddCircleIcon/>} onClick={(e) => this.handleQuestionOptions(e, null, "Add")}>
                          Tambah  pilihan
                        </Button>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Divider flexItem orientation="vertical" />
              <Grid item xs={3} sm={2} md={1} container direction="column" alignItems="center" className={classes.content}>
                <Grid item>
                  {/* <input
                    accept="image/*"
                    multiple
                    type="file"
                    name="avatar"
                    onChange={(e) => this.handleQuestionImage(e, i)}
                    ref={this.imageUploader}
                    style={{
                      display: "none",
                      visibility: "hidden",
                    }}
                  /> */}
                  <LightTooltip title="Tambahkan " placement="right">
                    <IconButton onClick={() => this.imageUploader.current.click()}>
                      <AddPhotoAlternateIcon/>
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Duplikat Soal" placement="right">
                    <IconButton 
                    // onClick={() => this.handleDuplicateQueston(i, question)}
                    >
                      <FilterNoneIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Hapus Soal" placement="right">
                    <IconButton 
                    onClick={() => { deleteQuestion(number - 1)}}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
    )
  }
}

export default withStyles(styles)(React.memo(QuestionItem));