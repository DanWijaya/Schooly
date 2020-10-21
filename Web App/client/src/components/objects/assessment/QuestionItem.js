import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import { Button, Divider, FormControl, FormControlLabel, Grid, GridList, GridListTile, GridListTileBar,
   IconButton, Paper, Radio, RadioGroup, TextField, Typography, Checkbox, FormGroup } from "@material-ui/core";
 import { makeStyles } from "@material-ui/core/styles";
 import AddCircleIcon from "@material-ui/icons/AddCircle";
 import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
 import ClearIcon from "@material-ui/icons/Clear";
 import CloseIcon from "@material-ui/icons/Close";
 import DeleteIcon from "@material-ui/icons/Delete";
 import FilterNoneIcon from "@material-ui/icons/FilterNone";

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

function QuestionItem(props){
  const { index, name, options, answer, lampiran, lampiranToAdd, currentLampiran, isEdit, lampiran_length, deleteQuestion, handleQuestionOptions , handleChangeQuestion, handleDuplicateQuestion, handleQuestionImage, buildImgTag, type} = props
  const classes = useStyles()

  const [lampiranToPreview, setLampiranToPreview] = React.useState([])
  // dipakai untuk edit assessment
  // const [currentLampiran, setCurrentLampiran] = React.useState([])

  let list_options = JSON.parse(options)
  const imageUploader = React.useRef();

  const imageUpload = () => {
    imageUploader.current.value = null
    imageUploader.current.click()
  }

  console.log(options)
  console.log(type)

  const handlePreviewImage = (arr_lampiran) => {
    if(Array.isArray(arr_lampiran)){
      Promise.all(arr_lampiran.map((l) => {
        return (new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = e => {
            resolve(e.target.result);
          }
          reader.addEventListener('error', reject);
          reader.readAsDataURL(l);
        }))
      }))
      .then((res) => {
        setLampiranToPreview(res)
      })
      .catch(err => console.log(err))
    }
  }

  React.useEffect(() => {
    console.log("Lampiran to preview set to empty")
    setLampiranToPreview([])
  },[])
  React.useEffect(() => {
    if(!isEdit){
      handlePreviewImage(lampiran)
    }
  },[lampiran_length])

  React.useEffect(() => {
    if(isEdit){
      handlePreviewImage(lampiranToAdd)
    }
  }, [lampiranToAdd.length])

  console.log("Current lampiran : ", currentLampiran)
  console.log("Lampiran to preview: ", lampiranToPreview)
  return(
    <Grid item>
      <Paper>
        <Grid container>
          <Grid item xs sm md container direction="column" spacing={2} className={classes.content}>
            <Grid item>
              <Typography variant="h6" gutterBottom>
                Soal {index + 1}
              </Typography>
              <GridList cols={3} cellHeight={300} style={{margin: "10px 0px 10px 0px"}}>
                {isEdit ?
                  currentLampiran.map((image, i) =>
                    <GridListTile key={image} cols={1} >
                    <img alt="current image" src={`/api/upload/att_assessment/${image}`}/>
                    <GridListTileBar
                      titlePosition="top"
                      actionIcon={
                        <IconButton style={{color: "white"}} onClick={(e) => handleQuestionImage(e, index, i)}>
                          <CloseIcon />
                        </IconButton>
                      }
                      title={`Gambar ${i+1}`}
                      actionPosition="right"/>
                    </GridListTile>
                  )
                :
                null
                }
              {lampiranToPreview.map((image, i) =>
                <GridListTile key={image} cols={1} >
                  <img alt="current image" src={image}/>
                  <GridListTileBar
                      titlePosition="top"
                      actionIcon={
                        <IconButton style={{color: "white"}} onClick={(e) => handleQuestionImage(e, index, i)}>
                          <CloseIcon />
                        </IconButton>
                      }
                      title={`Gambar ${i+1+currentLampiran.length}`}
                      actionPosition="right"
                    />
                </GridListTile>
              )}
              </GridList>
              <TextField
                helperText={!name.length ? "Belum diisi" : null}
                error={!name.length}
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
                {(props.type === "radio") ? 
                  <RadioGroup value={answer.toUpperCase()} id="answer" onChange={(e) => handleChangeQuestion(e, index, "answer", "radio")}>
                    {list_options.map((option, i) =>
                      <div style={{display: "flex"}}>
                        <FormControlLabel
                          style={{width: "100%"}}
                          value={String.fromCharCode(97 + i).toUpperCase()}
                          control={<Radio color="primary" />}
                          label={
                            <TextField
                              helperText={!option.length ? "Belum diisi" : null}
                              error={!option.length}
                              onError={() => console.log("ERROR textfield")}
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
                :
                  <div>
                    <FormGroup >
                    {list_options.map((option, i) =>
                      <div style={{display: "flex"}}>
                        <FormControlLabel
                          style={{width: "100%"}}
                          value={String.fromCharCode(97 + i).toUpperCase()}
                          control={<Checkbox name="gilad" color="primary" onChange={(e) => handleChangeQuestion(e, index, "answer", "checkbox")}/>}
                          label={
                            <TextField
                              helperText={!option.length ? "Belum diisi" : null}
                              error={!option.length}
                              onError={() => console.log("ERROR textfield")}
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
                    </FormGroup>
                  </div>
                  
              }
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
                onChange={(e) =>{handleQuestionImage(e, index, null)}}
                ref={imageUploader}
                style={{
                  display: "none",
                  visibility: "hidden",
                }}
              />
              <LightTooltip title="Tambahkan " placement="right">
                <IconButton
                onClick={imageUpload}
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

export default React.memo(QuestionItem)
// export default QuestionItem;
