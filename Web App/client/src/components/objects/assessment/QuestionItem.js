import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  Hidden,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import ClearIcon from "@material-ui/icons/Clear";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import HelpIcon from "@material-ui/icons/Help";

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
  addQuestionButton: {
    color: "white",
    padding: "2px",
    borderRadius: "100%",
    "&:focus, &:hover": {
      backgroundColor: "white",
    },
  },
  RadioQst: {
    backgroundColor: theme.palette.radio.main,
  },
  CheckboxQst: {
    padding: "3px",
    backgroundColor: theme.palette.checkbox.main,
  },
  ShorttextQst: {
    backgroundColor: theme.palette.shorttext.main,
  },
  LongtextQst: {
    backgroundColor: theme.palette.longtext.main,
  },
  questionNameDiv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  formLabel: {
    display: "flex",
    flexGrow: "1",
  },
  helpIcon: {
    cursor: "default",
    color: "grey",
    marginTop: "5px",
  },
  inputSize: {
    fontSize: "inherit!important",
  },
}));

function QuestionItem(props) {
  const {
    index,
    name,
    options,
    answer,
    lampiran,
    lampiranToAdd,
    currentLampiran,
    isEdit,
    lampiran_length,
    deleteQuestion,
    handleQuestionOptions,
    handleChangeQuestion,
    handleDuplicateQuestion,
    handleQuestionImage,
    type,
    check_data,
    parseAnswer,
    handleLongtextWeight,
    longtextWeight,
    backtickError,
    renderbtErrors,
    lampiranUrls,
  } = props;
  const classes = useStyles();

  const [checked, setChecked] = React.useState(check_data);
  const [dummyRender, setDummyRender] = React.useState(0); // Hanya Untuk Force Re-render
  const [val, setValue] = React.useState("");
  const textRef = React.useRef(null);
  const [longtextValue, setLongtextValue] = React.useState("");
  const [longtextAnswer, setLongtextAnswer] = React.useState("");
  const [localBtError, setLocalBtError] = React.useState(false);
  const [lampiranToPreview, setLampiranToPreview] = React.useState([]);
  // dipakai untuk edit assessment
  // const [currentLampiran, setCurrentLampiran] = React.useState([])

  // Fitur 2 - Fungsi Untuk Memastikan Kondisi Checked Pada Checkbox Ketika Dicentang
  function handleCheck(e, i, index, answer, type) {
    let temp_cek = checked;
    temp_cek[i] = e.target.checked;
    if (check_data[i]) {
      check_data[i] = false;
    }
    if (!check_data[i]) {
      check_data[i] = true;
    }
    setChecked(temp_cek);
    setDummyRender(dummyRender + 1); // Force Re-render
    handleChangeQuestion(e, index, null, answer, type);
  }

  let list_options = JSON.parse(options);
  const imageUploader = React.useRef();
  // console.log("A".charCodeAt(0))
  const imageUpload = () => {
    imageUploader.current.value = null;
    imageUploader.current.click();
  };

  // console.log(options)
  // console.log(type)

  const handlePreviewImage = (arr_lampiran) => {
    if (Array.isArray(arr_lampiran)) {
      Promise.all(
        arr_lampiran.map((l) => {
          return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target.result);
            };
            reader.addEventListener("error", reject);
            reader.readAsDataURL(l);
          });
        })
      )
        .then((res) => {
          setLampiranToPreview(res);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleTextFieldChange = (e) => {
    if (e.target.value.length <= 1) {
      //agar setelah mengetikan karakter, error "belum diisi" langsung hilang
      handleChangeQuestion(e, index);
    }
    setLocalBtError(false);
    setValue(e.target.value);
  };

  const handleBlur = (e, index) => {
    if (document.activeElement !== textRef.current) {
      // document.activeElement !== textRef.current ketika beralih dari textfield ke elemen lain di halaman tersebut,
      // document.activeElement === textRef.current ketika fokus beralih dari textfield ke window lain
      parseAnswer(textRef.current.value, index);
      handleChangeQuestion(e, index, textRef.current.value); // e.target.id berisi id elemen pemanggil handleBlur ini
    }
  };
  React.useEffect(() => {
    setValue(name);
  }, [name]);
  React.useEffect(() => {
    setLocalBtError(backtickError);
  }, [renderbtErrors]);
  React.useEffect(() => {
    if (type === "longtext") {
      if (answer && answer.length !== 0) {
        setLongtextAnswer(answer[0]);
      }
    }
  }, [answer, type]);
  React.useEffect(() => {
    setLongtextValue(longtextWeight);
  }, [longtextWeight]);

  React.useEffect(() => {
    console.log("Lampiran to preview set to empty");
    setLampiranToPreview([]);
  }, []);
  React.useEffect(() => {
    if (!isEdit) {
      handlePreviewImage(lampiran);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lampiran_length]);

  React.useEffect(() => {
    if (isEdit) {
      handlePreviewImage(lampiranToAdd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lampiranToAdd.length]);

  // console.log("Current lampiran : ", currentLampiran);
  // console.log("Lampiran to preview: ", lampiranToPreview);
  let lampiranToUrl = isEdit ? new Map(JSON.parse(lampiranUrls)) : null;

  return (
    <Grid item>
      <Paper>
        <Grid container>
          <Grid
            item
            xs
            sm
            md
            container
            direction="column"
            spacing={2}
            className={classes.content}
          >
            <Grid item>
              <Typography variant="h6" style={{ marginLeft: "5px" }}>
                Soal {index + 1}
              </Typography>
              <Hidden smDown>
                <GridList
                  cols={3}
                  cellHeight={300}
                  style={{ margin: "10px 0px 10px 0px" }}
                >
                  {isEdit
                    ? currentLampiran.map((image, i) => (
                        <GridListTile key={image} cols={1}>
                          <img
                            alt="current img"
                            // src={`/api/upload/att_assessment/${image}`
                            src={lampiranToUrl.get(image.toString())}
                          />
                          <GridListTileBar
                            titlePosition="top"
                            actionIcon={
                              <IconButton
                                style={{ color: "white" }}
                                onClick={(e) =>
                                  handleQuestionImage(e, index, i)
                                }
                              >
                                <CloseIcon />
                              </IconButton>
                            }
                            title={`Gambar ${i + 1}`}
                            actionPosition="right"
                          />
                        </GridListTile>
                      ))
                    : null}
                  {lampiranToPreview.map((image, i) => (
                    <GridListTile key={image} cols={1}>
                      <img alt="current img" src={image} />
                      <GridListTileBar
                        titlePosition="top"
                        actionIcon={
                          <IconButton
                            style={{ color: "white" }}
                            // onClick={(e) => handleQuestionImage(e, index, i + currentLampiran.length)
                            onClick={(e) => handleQuestionImage(e, index, i)}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                        title={`Gambar ${i + 1 + currentLampiran.length}`}
                        actionPosition="right"
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Hidden>
              <Hidden mdUp xsDown>
                <GridList
                  cols={2}
                  cellHeight={300}
                  style={{ margin: "10px 0px 10px 0px" }}
                >
                  {isEdit
                    ? currentLampiran.map((image, i) => (
                        <GridListTile key={image} cols={1}>
                          <img
                            alt="current img"
                            // src={`/api/upload/att_assessment/${image}`
                            src={lampiranToUrl.get(image.toString())}
                          />
                          <GridListTileBar
                            titlePosition="top"
                            actionIcon={
                              <IconButton
                                style={{ color: "white" }}
                                // onClick={(e) => handleQuestionImage(e, index, i + currentLampiran.length)
                                onClick={(e) =>
                                  handleQuestionImage(e, index, i)
                                }
                              >
                                <CloseIcon />
                              </IconButton>
                            }
                            title={`Gambar ${i + 1}`}
                            actionPosition="right"
                          />
                        </GridListTile>
                      ))
                    : null}
                  {lampiranToPreview.map((image, i) => (
                    <GridListTile key={image} cols={1}>
                      <img alt="current img" src={image} />
                      <GridListTileBar
                        titlePosition="top"
                        actionIcon={
                          <IconButton
                            style={{ color: "white" }}
                            onClick={(e) => handleQuestionImage(e, index, i)}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                        title={`Gambar ${i + 1 + currentLampiran.length}`}
                        actionPosition="right"
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Hidden>
              <Hidden smUp>
                <GridList
                  cols={1}
                  cellHeight={300}
                  style={{ margin: "10px 0px 10px 0px" }}
                >
                  {isEdit
                    ? currentLampiran.map((image, i) => (
                        <GridListTile key={image} cols={1}>
                          <img
                            alt="current img"
                            // src={`/api/upload/att_assessment/${image}`
                            src={lampiranToUrl.get(image.toString())}
                          />
                          <GridListTileBar
                            titlePosition="top"
                            actionIcon={
                              <IconButton
                                style={{ color: "white" }}
                                onClick={(e) =>
                                  handleQuestionImage(e, index, i)
                                }
                              >
                                <CloseIcon />
                              </IconButton>
                            }
                            title={`Gambar ${i + 1}`}
                            actionPosition="right"
                          />
                        </GridListTile>
                      ))
                    : null}
                  {lampiranToPreview.map((image, i) => (
                    <GridListTile key={image} cols={1}>
                      <img alt="current img" src={image} />
                      <GridListTileBar
                        titlePosition="top"
                        actionIcon={
                          <IconButton
                            style={{ color: "white" }}
                            onClick={(e) => handleQuestionImage(e, index, i)}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                        title={`Gambar ${i + 1 + currentLampiran.length}`}
                        actionPosition="right"
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Hidden>
              {type === "shorttext" ? (
                <TextField
                  FormHelperTextProps={{
                    style: {
                      marginRight: "12px",
                    },
                  }}
                  helperText={
                    <>
                      {!name.length ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="caption">Belum diisi</Typography>
                          <LightTooltip
                            title="Gunakan karakter backtick (`) untuk menandai posisi kotak isian pada soal. 
                        Karakter-karakter yang diapit oleh pasangan backtick akan disimpan sebagai kunci jawaban untuk sebuah kotak isian."
                          >
                            <HelpIcon
                              fontSize="small"
                              className={classes.helpIcon}
                            />
                          </LightTooltip>
                        </div>
                      ) : localBtError ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="caption">
                            Periksa kembali
                          </Typography>
                          <LightTooltip
                            title="Gunakan karakter backtick (`) untuk menandai posisi kotak isian pada soal. 
                        Karakter-karakter yang diapit oleh pasangan backtick akan disimpan sebagai kunci jawaban untuk sebuah kotak isian."
                          >
                            <HelpIcon
                              fontSize="small"
                              className={classes.helpIcon}
                            />
                          </LightTooltip>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <LightTooltip
                            title="Gunakan karakter backtick (`) untuk menandai posisi kotak isian pada soal. 
                        Karakter-karakter yang diapit oleh pasangan backtick akan disimpan sebagai kunci jawaban untuk sebuah kotak isian."
                          >
                            <HelpIcon
                              fontSize="small"
                              className={classes.helpIcon}
                            />
                          </LightTooltip>
                        </div>
                      )}
                    </>
                  }
                  error={!name.length || localBtError}
                  multiline
                  rowsMax={10}
                  id="name"
                  fullWidth
                  variant="filled"
                  value={val}
                  inputRef={textRef}
                  onChange={(e) => {
                    handleTextFieldChange(e);
                  }}
                  onBlur={(e) => {
                    handleBlur(e, index);
                  }}
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">
                  //       <LightTooltip title="Gunakan karakter backtick (`) untuk menandai posisi kotak isian pada soal. Karakter-karakter yang diapit oleh pasangan backtick akan disimpan sebagai kunci jawaban untuk sebuah kotak isian.">
                  //         <HelpIcon fontSize="small" style={{cursor: "default", color: "grey" }} />
                  //       </LightTooltip>
                  //     </InputAdornment>
                  //   ),
                  // }}
                />
              ) : (
                <TextField
                  helperText={!name.length ? "Belum diisi" : null}
                  error={!name.length}
                  multiline
                  rowsMax={10}
                  id="name"
                  fullWidth
                  variant="filled"
                  value={val}
                  inputRef={textRef}
                  onChange={(e) => {
                    handleTextFieldChange(e);
                  }}
                  onBlur={(e) => {
                    handleChangeQuestion(e, index, textRef.current.value);
                  }}
                />
              )}
            </Grid>
            <Grid item>
              {type === "radio" ? (
                <FormControl component="fieldset" id="answer" fullWidth>
                  <RadioGroup
                    value={
                      answer && answer.length !== 0
                        ? answer[0].toUpperCase()
                        : null
                    }
                    id="answer"
                    onChange={(e) =>
                      handleChangeQuestion(e, index, null, "answer", "radio")
                    }
                  >
                    {list_options.map((option, i) => (
                      <div style={{ display: "flex" }}>
                        <FormControlLabel
                          style={{ width: "100%" }}
                          value={String.fromCharCode(97 + i).toUpperCase()}
                          control={<Radio color="primary" />}
                          label={
                            <TextField
                              helperText={!option.length ? "Belum diisi" : null}
                              error={!option.length}
                              onError={() => console.log("ERROR textfield")}
                              style={{ flexGrow: 1 }}
                              value={option}
                              onChange={(e) =>
                                handleQuestionOptions(e, i, index, "Edit")
                              }
                              placeholder="Isi Pilihan"
                            />
                          }
                          classes={{ label: classes.formLabel }}
                        />
                        <IconButton
                          onClick={(e) =>
                            handleQuestionOptions(e, i, index, "Delete")
                          }
                        >
                          <ClearIcon />
                        </IconButton>
                      </div>
                    ))}
                    <div>
                      <Button
                        className={classes.addOptionButton}
                        startIcon={<AddCircleIcon />}
                        onClick={(e) =>
                          handleQuestionOptions(e, null, index, "Add")
                        }
                      >
                        Tambah pilihan
                      </Button>
                    </div>
                  </RadioGroup>
                </FormControl>
              ) : type === "checkbox" ? (
                <FormControl component="fieldset" id="answer" fullWidth>
                  <FormGroup>
                    {list_options.map((option, i) => (
                      <div style={{ display: "flex" }}>
                        <FormControlLabel
                          style={{ width: "100%" }}
                          value={String.fromCharCode(97 + i).toUpperCase()}
                          control={
                            <Checkbox
                              checked={check_data[i]}
                              color="primary"
                              onChange={(e) =>
                                handleCheck(e, i, index, "answer", "checkbox")
                              }
                            />
                          }
                          label={
                            <TextField
                              helperText={!option.length ? "Belum diisi" : null}
                              error={!option.length}
                              onError={() => console.log("ERROR textfield")}
                              style={{ flexGrow: 1 }}
                              value={option}
                              onChange={(e) =>
                                handleQuestionOptions(e, i, index, "Edit")
                              }
                              placeholder="Isi Pilihan"
                            />
                          }
                          classes={{ label: classes.formLabel }}
                        />
                        <IconButton
                          onClick={(e) =>
                            handleQuestionOptions(e, i, index, "Delete")
                          }
                        >
                          <ClearIcon />
                        </IconButton>
                      </div>
                    ))}
                    <div>
                      <Button
                        className={classes.addOptionButton}
                        startIcon={<AddCircleIcon />}
                        onClick={(e) =>
                          handleQuestionOptions(e, null, index, "Add")
                        }
                      >
                        Tambah pilihan
                      </Button>
                    </div>
                  </FormGroup>
                </FormControl>
              ) : type === "longtext" ? (
                <div style={{ marginTop: "16px" }}>
                  <Typography style={{ marginBottom: "16px" }}>
                    <b>Jawaban:</b>
                  </Typography>
                  <TextField
                    helperText={
                      longtextAnswer.length === 0 ? "Belum diisi" : null
                    }
                    error={longtextAnswer.length === 0}
                    multiline
                    rowsMax={10}
                    fullWidth
                    variant="outlined"
                    // defaultValue={longtextAnswer}
                    defaultValue={
                      answer && answer.length !== 0 ? answer[0] : null
                    }
                    onBlur={() => {
                      handleChangeQuestion(
                        longtextAnswer,
                        index,
                        null,
                        "answer",
                        "longtext"
                      );
                    }}
                    onChange={(e) => {
                      setLongtextAnswer(e.target.value);
                    }}
                  />
                </div>
              ) : null}
            </Grid>
          </Grid>
          <Divider flexItem orientation="vertical" />
          <Grid
            item
            xs={3}
            sm={2}
            md={1}
            container
            direction="column"
            alignItems="center"
            className={classes.content}
          >
            <Grid item>
              <input
                accept="image/*"
                multiple
                type="file"
                name="avatar"
                onChange={(e) => {
                  handleQuestionImage(e, index, null);
                }}
                ref={imageUploader}
                style={{
                  display: "none",
                  visibility: "hidden",
                }}
              />
              <LightTooltip title="Tambahkan Gambar" placement="right">
                <IconButton onClick={imageUpload}>
                  <AddPhotoAlternateIcon />
                </IconButton>
              </LightTooltip>
            </Grid>
            <Grid item>
              <LightTooltip title="Duplikat Soal" placement="right">
                <IconButton onClick={() => handleDuplicateQuestion(index)}>
                  <FilterNoneIcon />
                </IconButton>
              </LightTooltip>
            </Grid>
            <Grid item>
              <LightTooltip title="Hapus Soal" placement="right">
                <IconButton
                  onClick={() => {
                    deleteQuestion(index);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </LightTooltip>
            </Grid>
          </Grid>
        </Grid>

        {props.type === "longtext" ? (
          <div>
            <Divider />
            <Grid
              container
              style={{ padding: "20px" }}
              justify="flex-end"
              alignItems="center"
            >
              {/* <Grid item style={{ marginRight: "20px", height: "3rem", display: "flex", alignItems: "center"}}> */}
              <Grid item style={{ marginRight: "20px" }}>
                <Typography color="primary">Bobot: </Typography>
              </Grid>
              <Grid item style={{ height: "3rem" }}>
                <TextField
                  value={longtextValue}
                  onChange={(e) => {
                    handleLongtextWeight(e, index);
                  }}
                  variant="outlined"
                  // lihat catatan inisialisasi state longtextWeight di edit/create assessment untuk info terkait nilai longtextValue
                  error={
                    (isNaN(Number(longtextValue)) ||
                      Number(longtextValue) <= 0) &&
                    longtextValue !== undefined
                  }
                  helperText={
                    (isNaN(Number(longtextValue)) ||
                      Number(longtextValue) <= 0) &&
                    longtextValue !== undefined
                      ? "Periksa Kembali!"
                      : null
                  }
                  FormHelperTextProps={{
                    style: {
                      margin: "0px",
                    },
                  }}
                  InputProps={{
                    style: {
                      borderBottom: "none",
                      boxShadow: "none",
                      width: "100px",
                    },
                    endAdornment: (
                      <Typography color="textSecondary">{` Poin`}</Typography>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </div>
        ) : null}
      </Paper>
    </Grid>
  );
}

export default React.memo(
  QuestionItem,
  function arePropsEqual(prevProps, nextProps) {
    // second argument
    return (
      prevProps.name === nextProps.name &&
      prevProps.options === nextProps.options &&
      prevProps.answer === nextProps.answer &&
      prevProps.lampiran_length === nextProps.lampiran_length &&
      prevProps.longtextWeight === nextProps.longtextWeight &&
      prevProps.renderbtErrors === nextProps.renderbtErrors &&
      prevProps.lampiranUrls === nextProps.lampiranUrls
    );
  }
);
