import React from "react";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  AddCircle as AddCircleIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Help as HelpIcon,
} from "@material-ui/icons";
import { MdContentCopy } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
  },
  optionLabel: {
    display: "flex",
    flexGrow: "1",
  },
  optionField: {
    "&::before": {
      border: "none",
    },
  },
}));

function QuestionItem(props) {
  const classes = useStyles();
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

  const [checked, setChecked] = React.useState(check_data);
  const [dummyRender, setDummyRender] = React.useState(0); // Only for force re-rendering.
  const [val, setValue] = React.useState("");
  const textRef = React.useRef(null);
  const [longtextValue, setLongtextValue] = React.useState("");
  const [longtextAnswer, setLongtextAnswer] = React.useState("");
  const [localBtError, setLocalBtError] = React.useState(false);
  const [lampiranToPreview, setLampiranToPreview] = React.useState([]);
  const weightInput = React.useRef(null);
  // Used to edit assessment
  // const [currentLampiran, setCurrentLampiran] = React.useState([])

  // function to check checked condition in checkbox when it is checked.
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
  const imageUpload = () => {
    imageUploader.current.value = null;
    imageUploader.current.click();
  };

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
    }
  };

  const handleTextFieldChange = (e) => {
    if (e.target.value.length <= 1) {
      // So that when typing a character, error "belum diisi" will vanish.
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
    if (
      weightInput.current &&
      weightInput.current.value !== longtextValue &&
      (longtextValue === undefined || longtextValue === null)
    ) {
      weightInput.current.value = "";
    }
  }, [longtextValue]);
  React.useEffect(() => {
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

  let lampiranToUrl = isEdit ? new Map(JSON.parse(lampiranUrls)) : null;

  return (
    <Grid item>
      <Paper className={classes.root}>
        <Typography variant="h6" paragraph>
          Soal {index + 1}
        </Typography>
        <Grid container direction="column" spacing={2}>
          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <GridList
                cols={3}
                cellHeight={300}
              >
                {isEdit ? currentLampiran.map((image, i) => (
                    <GridListTile key={image} cols={1}>
                      <img
                        alt="current img"
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
            </Grid>
            <Grid item>
              {type === "shorttext" ? (
                <>
                  <TextField
                    fullWidth
                    multiline
                    variant="filled"
                    id="name"
                    rowsMax={10}
                    value={val}
                    inputRef={textRef}
                    onChange={(e) => {handleTextFieldChange(e)}}
                    onBlur={(e) => {handleBlur(e, index)}}
                    error={!name.length || localBtError}
                  />
                  <FormHelperText style={{ marginLeft: "14px" }}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        {!name.length ? (
                            <Typography variant="caption" color="error">
                              Kosong
                            </Typography>
                          ) : localBtError ? (
                            <Typography variant="caption" color="error">
                              Periksa Kembali
                            </Typography>
                          ) : null
                        }
                      </Grid>
                      <Grid item xs container justify="flex-end">
                        <Grid item>
                          <Tooltip title="Apit bagian jawaban dari soal dengan karakter `">
                            <HelpIcon fontSize="small" />
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </FormHelperText>
                </>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  variant="filled"
                  id="name"
                  rowsMax={10}
                  value={val}
                  inputRef={textRef}
                  onChange={(e) => {handleTextFieldChange(e)}}
                  onBlur={(e) => {handleChangeQuestion(e, index, textRef.current.value)}}
                  error={!name.length}
                  helperText={!name.length ? "Kosong" : null}
                />
              )}
            </Grid>
            <Grid item>
              {type === "radio" ? (
                <FormControl id="answer" fullWidth>
                  <RadioGroup
                    id="answer"
                    value={
                      answer && answer.length !== 0
                        ? answer[0].toUpperCase()
                        : null
                    }
                    onChange={(e) =>
                      handleChangeQuestion(e, index, null, "answer", "radio")
                    }
                  >
                    {list_options.map((option, i) => (
                      <div style={{ display: "flex" }}>
                        <FormControlLabel
                          style={{ width: "100%" }}
                          classes={{ label: classes.optionLabel }}
                          value={String.fromCharCode(97 + i).toUpperCase()}
                          control={<Radio color="primary" />}
                          label={
                            <TextField
                              placeholder="Isi Pilihan"
                              style={{ flexGrow: 1 }}
                              value={option}
                              onChange={(e) => handleQuestionOptions(e, i, index, "Edit")}
                              error={!option.length}
                              helperText={!option.length ? "Kosong" : null}
                              InputProps={{
                                className: classes.optionField
                              }}
                            />
                          }
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
                    <div style={{ marginTop: "16px" }}>
                      <Button
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={(e) => handleQuestionOptions(e, null, index, "Add")}
                      >
                        Tambah Opsi
                      </Button>
                    </div>
                  </RadioGroup>
                </FormControl>
              ) : type === "checkbox" ? (
                <FormControl id="answer" fullWidth>
                  <FormGroup>
                    {list_options.map((option, i) => (
                      <div style={{ display: "flex" }}>
                        <FormControlLabel
                          style={{ width: "100%" }}
                          classes={{ label: classes.optionLabel }}
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
                              placeholder="Isi Pilihan"
                              style={{ flexGrow: 1 }}
                              value={option}
                              onChange={(e) => handleQuestionOptions(e, i, index, "Edit")}
                              error={!option.length}
                              helperText={!option.length ? "Kosong" : null}
                              InputProps={{
                                className: classes.optionField
                              }}
                            />
                          }
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
                    <div style={{ marginTop: "16px" }}>
                      <Button
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={(e) =>
                          handleQuestionOptions(e, null, index, "Add")
                        }
                      >
                        Tambah Opsi
                      </Button>
                    </div>
                  </FormGroup>
                </FormControl>
              ) : type === "shorttext" ? (
                null
              ) : type === "longtext" ? (
                <>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Jawaban:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    rowsMax={10}
                    defaultValue={answer && answer.length !== 0 ? answer[0] : null}
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
                    error={longtextAnswer.length === 0}
                    helperText={longtextAnswer.length === 0 ? "Kosong" : null}
                  />
                </>
              ) : null}
            </Grid>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item container justify="space-between" alignItems="center">
            {props.type === "longtext" ? (
              <Grid item>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography display="inline" color="primary">Bobot: </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      type="number"
                      value={longtextValue}
                      inputRef={weightInput}
                      onChange={(e) => {
                        handleLongtextWeight(e, index);
                      }}
                      error={
                        (isNaN(Number(longtextValue)) ||
                          Number(longtextValue) <= 0) &&
                        longtextValue !== undefined
                      }
                      InputProps={{
                        style: { width: "70px" },
                        endAdornment: (
                          <Typography color="textSecondary" style={{ marginLeft: "5px" }}>Poin</Typography>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            <Grid item xs>
              <Grid container justify="flex-end">
                <Grid item>
                  <input
                    multiple
                    type="file"
                    accept="image/*"
                    name="avatar"
                    ref={imageUploader}
                    style={{ display: "none" }}
                    onChange={(e) => handleQuestionImage(e, index, null)}
                  />
                  <Tooltip title="Unggah Gambar">
                    <IconButton onClick={imageUpload}>
                      <AddPhotoAlternateIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Duplikat Soal">
                    <IconButton onClick={() => handleDuplicateQuestion(index)}>
                      <MdContentCopy />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Hapus Soal">
                    <IconButton onClick={() => deleteQuestion(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default React.memo(
  QuestionItem,
  function arePropsEqual(prevProps, nextProps) {
    // Second argument
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
