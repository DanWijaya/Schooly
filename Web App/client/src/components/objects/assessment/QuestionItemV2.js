import React, {Component} from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import ClearIcon from "@material-ui/icons/Clear";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import SaveIcon from "@material-ui/icons/Save";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Avatar, Badge, Button, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Grid, GridList, GridListTile, GridListTileBar, MenuItem, IconButton, Paper, Radio, RadioGroup, TextField, Typography, Select } from "@material-ui/core";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";

const useStyles = makeStyles((theme) => ({
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
}));

function QuestionItemV2(props){
  const { index, name, options, answer, images, deleteQuestion, handleQuestionOptions , handleChangeQuestion, handleDuplicateQuestion, handleQuestionImage, buildImgTag} = props
  const classes = useStyles()

  let list_options = JSON.parse(options)
  let list_images = JSON.parse(images)

  const imageUploader = React.useRef();

  return(
    <Grid item>
          <Paper>
            <Grid container>
              <Grid item xs sm md container direction="column" spacing={2} className={classes.content}>
                <Grid item>
                  <Typography variant="h6" gutterBottom>
                    Soal {index + 1}
                  </Typography>
                  <GridList cellHeight={400} style={{margin: "10px 0px 10px 0px"}}>
                    {list_images.map((image, i) =>
                      <GridListTile key={image} cols={1} >
                        <img alt="current image" src={image}/>
                        <GridListTileBar
                            title={"HAHHA"}
                            titlePosition="top"
                            actionIcon={
                              <IconButton style={{color: "white"}} onClick={(e) => handleQuestionImage(e, index, i)}>
                                <CloseIcon />
                              </IconButton>
                            }
                            actionPosition="right"
                          />
                      </GridListTile>
                    )}
                  </GridList>
                  <TextField
                    multiline
                    rowsMax={10}
                    id="name"
                    fullWidth
                    variant="filled"
                    value={name}
                    onChange={(e) => handleChangeQuestion(e, index)}
                  />
                </Grid>
                <Grid item>
                  <FormControl component="fieldset" id="answer" fullWidth>
                    <RadioGroup value={answer.toUpperCase()} id="answer" onChange={(e) => handleChangeQuestion(e, index, "answer")}>
                      {list_options.map((option, i) =>
                        <div style={{display: "flex"}}>
                          {/*{console.log(question.answer.toUpperCase() === String.fromCharCode(97 + index).toUpperCase())}
                          <Radio
                            checked={question.answer.toUpperCase() === String.fromCharCode(97 + index).toUpperCase()}
                            value={String.fromCharCode(97 + index).toUpperCase()}
                            onChange={(e) => {console.log("AAA"); .handleChangeQuestion(e, i, "answer")}}
                          />
                          <TextField
                            fullWidth
                            value={option}
                            onChange={(e) => handleQuestionOptions(e, index, i, "Edit" )}
                            placeholder="Isi Pilihan"
                          />*/}
                          <FormControlLabel
                            style={{width: "100%"}}
                            value={String.fromCharCode(97 + i).toUpperCase()}
                            control={<Radio color="primary" />}
                            label={
                              <TextField
                                style={{flexGrow: 1}}
                                value={option}
                                onChange={(e) => handleQuestionOptions(e, i, index, "Edit" )}
                                placeholder="Isi Pilihan"
                              />
                            }
                          />
                          <IconButton onClick={(e) => handleQuestionOptions(e, i, index, "Delete" )}>
                            <ClearIcon/>
                          </IconButton>
                        </div>
                      )}
                      <div>
                        <Button className={classes.addOptionButton} startIcon={<AddCircleIcon/>} onClick={(e) => handleQuestionOptions(e, null, index, "Add")}>
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
                  <input
                    accept="image/*"
                    multiple
                    type="file"
                    name="avatar"
                    onChange={(e) => handleQuestionImage(e, index)}
                    ref={imageUploader}
                    style={{
                      display: "none",
                      visibility: "hidden",
                    }}
                  />
                  <LightTooltip title="Tambahkan " placement="right">
                    <IconButton 
                    onClick={() => imageUploader.current.click()}
                    >
                      <AddPhotoAlternateIcon/>
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Duplikat Soal" placement="right">
                    <IconButton 
                    onClick={() => handleDuplicateQuestion(index)}
                    >
                      <FilterNoneIcon />
                    </IconButton>
                  </LightTooltip>
                </Grid>
                <Grid item>
                  <LightTooltip title="Hapus Soal" placement="right">
                    <IconButton 
                    onClick={() => { deleteQuestion(index)}}
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

export default React.memo(QuestionItemV2)