import React from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Fab,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Hidden,
  IconButton,
  Input,
  ListItem,
  ListItemText,
  ListItemAvatar,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  formIcons: {
    width: "1rem",
    height: "1rem",
    marginRight: "7.5px",
    color: theme.palette.text.secondary,
  },
  formLabels: {
    display: "flex",
    alignItems: "center",
  },
  zeroHeightHelperText: {
    height: "0",
    display: "flex", // untuk men-disable "collapsing margin"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 2,
  },
  viewDialogChip: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  dummyInput: {
    height: "fit-content!important",
  },
  create_edit_dialogTopDiv: {
    backgroundColor: theme.palette.action.selected,
    display: "flex",
    justifyContent: "space-between",
    padding: "0 24px",
    [theme.breakpoints.up("md")]: {
      "&:hover": {
        cursor: "move",
      },
    },
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-end",
      backgroundColor: "transparent",
    },
  },
  view_dialogTopDiv: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 24px",
  },
  dialogTopIcons: {
    width: "20px",
    height: "20px",
    color: theme.palette.text.secondary,
  },
  addFileButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  wordFileTypeIcon: {
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    backgroundColor: "#FD931D",
  },
  otherFileTypeIcon: {
    backgroundColor: "#808080",
  },
  deleteIconButton: {
    marginLeft: "7.5px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  mdUpZeroTopPadding: {
    [theme.breakpoints.up("md")]: {
      paddingTop: "0!important",
    },
  },
  mdUpZeroBottomPadding: {
    [theme.breakpoints.up("md")]: {
      paddingBottom: "0!important",
    },
  },
  smDownZeroTopPadding: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0!important",
    },
  },
  smDownZeroBottomPadding: {
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "0!important",
    },
  },
  dialogTopIconButtons: {
    padding: "8px",
    "&focus, &:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  dialogContent: {
    display: "flex",
    padding: "0",
    flexDirection: "column",
    position: "relative",
  },
  createEditDialogScrollableDiv: {
    display: "flex",
    flexGrow: "1",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "16px 24px",
    flexDirection: "column",
  },
  viewDialogScrollableDiv: {
    flexGrow: "1",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "16px 24px",
  },
  viewDialogBottomDiv: {
    flex: "1 1 auto",
    overflowY: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  createEventButton: {
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  editEventButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  listItem: {
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.fade,
    },
  },
}));

function Event(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    selectedEventInfo,
    openEventDialog,
    handleCloseEventDialog,
    handleOpenEditDialog,
    showSnackbar,
    handleSetUnmountEventDialog,
    eventDialogMode,
    getAllEvents,
    downloadFileEvent,
    viewFileEvent,
    user,
    uploadLimit,
  } = props;

  const roleConverter = {
    Admin: "Pengelola",
    Teacher: "Guru",
    Student: "Murid",
  };
  const [errors, setErrors] = React.useState({});

  // Event Form
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [start_date, setStartDate] = React.useState(null);
  const [end_date, setEndDate] = React.useState(null);
  const [target_role, setTargetRole] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [author_id, setAuthorId] = React.useState("");
  const [isAllDay, setAllDay] = React.useState(false);

  // Attachment
  const [fileLampiran, setFileLampiran] = React.useState([]);
  const [fileLampiranToAdd, setFileLampiranToAdd] = React.useState([]);
  const [fileLampiranToDelete, setFileLampiranToDelete] = React.useState([]);
  const [originalFileLampiran, setOriginalFileLampiran] = React.useState([]);
  const lampiranUploader = React.useRef(null);

  // Date Time Picker
  const [openStartDatePicker, setOpenStartDatePicker] = React.useState(false);
  const [openStartDateTimePicker, setOpenStartDateTimePicker] = React.useState(
    false
  );
  const [openEndDatePicker, setOpenEndDatePicker] = React.useState(false);
  const [openEndDateTimePicker, setOpenEndDateTimePicker] = React.useState(
    false
  );
  const startDatePicker = React.useRef(null);
  const endDatePicker = React.useRef(null);

  // This ref is used to save time so that when user retick the checkbox (change to all day),
  // waktu yang pernah dimasukkan sebelumnya bisa ditampilkan kembali
  const lastSelectedTime = React.useRef(null);

  // Upload Dialog
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);

  // Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  // Other
  const [changeDialog, setChangeDialog] = React.useState(false);

  React.useEffect(() => {
    if (eventDialogMode === "view") {
      if (Object.keys(selectedEventInfo).length !== 0) {
        let {
          _id,
          name,
          location,
          start_date,
          end_date,
          to,
          description,
          author_id,
        } = selectedEventInfo;
        start_date = new Date(start_date);
        end_date = new Date(end_date);
        setName(name);
        setLocation(location);
        setStartDate(start_date);
        setEndDate(end_date);
        setTargetRole(to);
        setDescription(description);
        setAuthorId(author_id);
        getFileEvents(_id).then((result) => {
          setFileLampiran(result);
          setOriginalFileLampiran(result);
        });

        // In datetime picker, user can't set seconds.
        // So that the time 23:59:59 can only be set with ticking all day checkbox.

        if (
          end_date.getHours() === 23 &&
          end_date.getMinutes() === 59 &&
          end_date.getSeconds() === 59
        ) {
          setAllDay(true);
        }
      }
    }
  }, [selectedEventInfo]);

  const handleCreateEvent = () => {
    let formData = new FormData();
    if (fileLampiran) {
      for (let i = 0; i < fileLampiran.length; i++) {
        formData.append("lampiran_event", fileLampiran[i]);
      }
    }

    let invert = {
      Pengelola: "Admin",
      Guru: "Teacher",
      Murid: "Student",
    };
    let temp = target_role.map((elm) => roleConverter[elm]);
    temp.sort();
    let to = temp.map((elm) => invert[elm]);

    let eventData = {
      name,
      location,
      start_date,
      end_date,
      to,
      description,
      author_id: user._id,
      unit: user.unit,
    };
    if (Object.values(errors).every((error) => !error)) {
      setOpenUploadDialog(true);
      createEvent(formData, eventData)
        .then(() => {
          setUploadSuccess(true);
          getAllEvents(user.unit);
        })
        .catch((err) => {
          setOpenUploadDialog(false);
          setErrors(err);
        });
    }
  };

  const handleUpdateEvent = () => {
    let formData = new FormData();
    if (fileLampiranToAdd) {
      for (let i = 0; i < fileLampiranToAdd.length; i++) {
        formData.append("lampiran_event", fileLampiranToAdd[i]);
      }
    }

    let invert = {
      Pengelola: "Admin",
      Guru: "Teacher",
      Murid: "Student",
    };
    let temp = target_role.map((elm) => roleConverter[elm]);
    temp.sort();
    let to = temp.map((elm) => invert[elm]);

    let eventData = {
      name,
      location,
      start_date,
      end_date,
      to,
      description,
    };
    if (Object.values(errors).every((error) => !error)) {
      setOpenUploadDialog(true);
      updateEvent(
        formData,
        fileLampiranToDelete,
        eventData,
        selectedEventInfo._id
      )
        .then(() => {
          setUploadSuccess(true);
          getAllEvents(user.unit);
        })
        .catch((err) => {
          setOpenUploadDialog(false);
          setFileLampiran([...originalFileLampiran, ...fileLampiranToAdd]);
          setFileLampiranToDelete([]);
          setErrors(err);
        });
    }
  };

  const isValidDateTime = (d) => {
    return d instanceof Date && !isNaN(d);
  };

  const handleCheckAllDay = () => {
    let newStatus = !isAllDay;

    // If it is set to all day.
    if (newStatus) {
      setErrors({
        ...errors,
        start_date_custom: undefined,
        end_date_custom: undefined,
      });

      // In all day mode, only date is shown in datetime picker.
      // Time is not shown and will be set to 00:00 as start date) and 23:59 as end date.

      lastSelectedTime.current = {};
      if (isValidDateTime(start_date)) {
        // If date and time is valid,
        // set start time to 00:00:00 and date will not be changed.
        setStartDate(getDayStart(start_date));

        // Save time.
        lastSelectedTime.current.start_date = {
          hour: start_date.getHours(),
          minute: start_date.getMinutes(),
        };
      } else {
        // If date and time is not valid,,
        if (startDatePicker.current.getAttribute("value")) {
          // If textfield contains something,
          // Get string that will be shown to datetime picker textfield.

          // This string will has the same format like the one is being used in datetime picker: "dd/MM/yyyy - HH:mm".
          let parsedStr = startDatePicker.current
            .getAttribute("value")
            .split(" ");
          let dateStr = parsedStr[0];
          let timeStr = parsedStr[2];

          // Try to parse date.
          let [day, month, year] = dateStr.split("/");

          // Rearrange date because parser js will parse date in format "dd/MM/yyyy" into "MM/dd/yyyy".
          // Didn't use new Date(int year, int month, int day) because month value > 11, month < 0, day < 1, and day > 31 or 30 still can be received and produce a valid date.
          let parsedDate = new Date(`${year}-${month}-${day}`);

          // If date is not valid, set start date into today.
          setStartDate(isValidDateTime(parsedDate) ? parsedDate : new Date());

          // Try to parse time.
          let [hour, minute] = timeStr.split(":");
          let parsedTime = new Date(0, 0, 0, Number(hour), Number(minute), 0);

          if (isValidDateTime(parsedTime)) {
            // Save time.
            lastSelectedTime.current.start_date = {
              hour: parsedTime.getHours(),
              minute: parsedTime.getMinutes(),
            };
          } else {
            // Save null value (When this saved time is used, this null value will be converted to 00:00).
            lastSelectedTime.current.start_date = null;
          }
        } else {
          // If picker textfield is empty,
          setStartDate(getDayStart(new Date()));
          lastSelectedTime.current.start_date = null;
        }
      }

      if (isValidDateTime(end_date)) {
        // If date and time is valid,
        // Set end time to 23:59:59, date is not changed.
        setEndDate(getDayEnd(end_date));

        // Save time.
        lastSelectedTime.current.end_date = {
          hour: end_date.getHours(),
          minute: end_date.getMinutes(),
        };
      } else {
        // If date or time is not valid,
        if (endDatePicker.current.getAttribute("value")) {
          // If picker textfield picker contains something,
          // Get string that is shown in datetime picker textfield.
          // This string will has the same format with the one that is being used in datetime picker: "dd/MM/yyyy - HH:mm".
          let parsedStr = endDatePicker.current
            .getAttribute("value")
            .split(" ");
          let dateStr = parsedStr[0];
          let timeStr = parsedStr[2];

          // Try to parse date.
          let [day, month, year] = dateStr.split("/");

          // Rearrange date because parser js will parse date in format "dd/MM/yyyy" into "MM/dd/yyyy".
          // Didn't use new Date(int year, int month, int day) because month value > 11, month < 0, day < 1, and day > 31 or 30 still can be received and produce a valid date.
          let parsedDate = new Date(`${year}-${month}-${day}`);

          // If date is not valid, set start date into today.
          setEndDate(isValidDateTime(parsedDate) ? parsedDate : new Date());

          // Try to parse time.
          let [hour, minute] = timeStr.split(":");
          let parsedTime = new Date(0, 0, 0, Number(hour), Number(minute), 0);

          if (isValidDateTime(parsedTime)) {
            // Save time.
            lastSelectedTime.current.end_date = {
              hour: parsedTime.getHours(),
              minute: parsedTime.getMinutes(),
            };
          } else {
            // Save null value (When this saved time is used, this null value will be converted into 00:00.
            lastSelectedTime.current.end_date = null;
          }
        } else {
          // If picker textfield is empty,
          setEndDate(getDayEnd(new Date()));
          lastSelectedTime.current.end_date = null;
        }
      }
    } else {
      // If it is not set to all day,
      if (isValidDateTime(start_date)) {
        // In all day mode, start time is already made so that it still contain 00:00:00 so that start time value still valid.
        // If start date is also valid,
        let start = new Date(start_date.getTime()); // Make a copy.

        if (lastSelectedTime.current !== null) {
          // lastSelectedTime.current === null when this form is loaded to edit mode.

          let startDate = lastSelectedTime.current.start_date;
          if (startDate === null) {
            // If saved time is null, it means that previous time that will be saved is not valid.
            // Reset time to 00:00:00.
            start.setHours(0, 0, 0, 0);
          } else {
            // If there is saved time, set start time into that saved time.
            start.setHours(startDate.hour, startDate.minute);
          }
        }
        setStartDate(start);
      } else {
        // If start time is not valid, set start date and time into right now.
        // There is still no particular reason why the time is not set to 00:00:00.
        setStartDate(new Date());
      }

      if (isValidDateTime(end_date)) {
        // In all day mode, end time already made so it still has the value of 23:59:59 and end time value will always be valid.

        // If end time is also valid,
        let end = new Date(end_date.getTime()); // Make a copy.

        if (lastSelectedTime.current !== null) {
          // lastSelectedTime.current === null when this form is loaded to edit mode.

          let endDate = lastSelectedTime.current.end_date;
          if (endDate === null) {
            // If saved time is null, it means that previous time that will be saved is not valid.
            // Reset time to 23:59:00.
            // It is not set to 23:59:59 because that time is used as a criteria to determine what event that will be retrieved from that database.
            // All day or not/There is code like this when laoding the edit form: if (time === 23:59:59) {all_day = true}).
            end.setHours(23, 59, 0);
          } else {
            // If there is saved time, set end time into that saved time.
            end.setHours(endDate.hour, endDate.minute);
          }
        }
        setEndDate(end);
      } else {
        // If end date is not valid, set end date and time into today.
        // There is still no particular reason why the time is not set to 23:59:59.
        setEndDate(new Date());
      }
    }
    setAllDay(newStatus);
  };

  const handleStartDateChange = (date) => {
    setErrors({ ...errors, start_date_submission: undefined });

    let startDate = date;
    if (isValidDateTime(startDate) && isValidDateTime(end_date)) {
      if (end_date.getTime() < startDate.getTime()) {
        setErrors({
          ...errors,
          start_date_custom: "Harus sebelum Waktu Selesai",
        });
      } else {
        setErrors({
          ...errors,
          start_date_custom: undefined,
          end_date_custom: undefined,
        });
      }
    } else {
      setErrors({ ...errors, start_date_custom: undefined });
    }

    if (isAllDay) {
      // This is need to be added because onChange at date picker can change time value.
      // It still not known that caused this.
      startDate.setHours(0, 0, 0, 0);
    }
    setStartDate(startDate);
  };

  const handleEndDateChange = (date) => {
    let endDate = date;
    if (isValidDateTime(start_date) && isValidDateTime(endDate)) {
      if (endDate.getTime() < start_date.getTime()) {
        setErrors({ ...errors, end_date_custom: "Harus setelah Waktu Mulai" });
      } else {
        setErrors({
          ...errors,
          start_date_custom: undefined,
          end_date_custom: undefined,
        });
      }
    } else {
      setErrors({ ...errors, end_date_custom: undefined });
    }

    if (isAllDay) {
      // This is need to be added because onChange at date picker can change time value.
      // It still not known that caused this.
      endDate.setHours(23, 59, 59, 999);
    }
    setEndDate(endDate);
  };

  const handleOpenStartPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenStartDatePicker(true);
    } else {
      setOpenStartDateTimePicker(true);
    }
  };

  const handleCloseStartPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenStartDatePicker(false);
    } else {
      setOpenStartDateTimePicker(false);
    }
  };

  const handleOpenEndPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenEndDatePicker(true);
    } else {
      setOpenEndDateTimePicker(true);
    }
  };

  const handleCloseEndPicker = (isAllDay) => {
    if (isAllDay) {
      setOpenEndDatePicker(false);
    } else {
      setOpenEndDateTimePicker(false);
    }
  };

  // Event Form
  const handleChangeName = (e) => {
    setErrors({ ...errors, name: undefined });
    setName(e.target.value);
  };

  const handleChangeTargetRole = (e) => {
    setErrors({ ...errors, to: undefined });
    setTargetRole(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setErrors({ ...errors, description: undefined });
    setDescription(e.target.value);
  };

  const fileType = (filename) => {
    let ext_file = Path.extname(filename);
    switch (ext_file) {
      case ".docx":
        return "Word";
      case ".xlsx":
      case ".csv":
        return "Excel";

      case ".png":
      case ".jpg":
      case ".jpeg":
        return "Gambar";

      case ".pdf":
        return "PDF";

      case ".txt":
      case ".rtf":
        return "Teks";

      case ".ppt":
      case ".pptx":
        return "Presentasi";

      default:
        return "File Lainnya";
    }
  };

  // Attachment
  const handleLampiranUpload = (e) => {
    if (eventDialogMode === "create") {
      const files = e.target.files;
      let temp = [...Array.from(fileLampiran), ...Array.from(files)];
      let over_limit = temp.filter(
        (file) => file.size / Math.pow(10, 6) > uploadLimit
      );
      let file_to_upload = temp.filter(
        (file) => file.size / Math.pow(10, 6) <= uploadLimit
      );

      if (errors.lampiran_materi) {
        // Because this error is in the form of lampiran_materi.
        setErrors({ ...errors, lampiran_materi: null });
      }
      setFileLampiran(file_to_upload);

      if (over_limit.length > 0) {
        showSnackbar(
          "error",
          over_limit.length + " file melebihi batas " + uploadLimit + "MB!"
        );
      }
      document.getElementById("file_control").value = null;

    } else if (eventDialogMode === "edit") {
      const files = Array.from(e.target.files);
      if (fileLampiran.length === 0) {
        let over_limit = files.filter(
          (file) => file.size / Math.pow(10, 6) > uploadLimit
        );
        let allowed_file = files.filter(
          (file) => file.size / Math.pow(10, 6) <= uploadLimit
        );
        setFileLampiran(allowed_file);
        setFileLampiranToAdd(allowed_file);

        if (over_limit.length > 0) {
          showSnackbar(
            "error",
            over_limit.length + " file melebihi batas " + uploadLimit + "MB!"
          );
        }
        document.getElementById("file_control").value = null;

      } else {
        if (files.length !== 0) {
          let allowed_file = files.filter(
            (file) => file.size / Math.pow(10, 6) <= uploadLimit
          );
          let over_limit = files.filter(
            (file) => file.size / Math.pow(10, 6) > uploadLimit
          );

          let temp = [...fileLampiran, ...allowed_file];
          let file_to_upload = [...fileLampiranToAdd, ...allowed_file];
          allowed_file = temp;

          setFileLampiran(allowed_file);
          setFileLampiranToAdd(file_to_upload);

          if (over_limit.length > 0) {
            showSnackbar(
              "error",
              over_limit.length + " file melebihi batas " + uploadLimit + "MB!"
            );
          }
        }
        document.getElementById("file_control").value = null;
      }
    }
  };

  const handleLampiranDelete = (e, i) => {
    e.preventDefault();
    if (eventDialogMode === "create") {
      let temp = Array.from(fileLampiran);
      temp.splice(i, 1);
      setFileLampiran(temp);
    } else if (eventDialogMode === "edit") {
      let temp = Array.from(fileLampiran);
      let tempToDelete = fileLampiranToDelete;
      let tempToAdd = fileLampiranToAdd;
      // For the one that has already been uploaded, there will be a filename field (the one that has no name yet).
      // For the one that has already in database.
      if (fileLampiran[i].filename !== undefined) {
        // Remove the file in fileLampiranToDelete.
        tempToDelete.push(temp[i]);
      } else {
        // For the one that"s not yet in database.
        // Remove the file in fileLampiranToAdd.
        for (var j = 0; j < tempToAdd.length; j++) {
          if (tempToAdd[j].name === temp[i].name) {
            tempToAdd.splice(j, 1);
          }
        }
      }
      temp.splice(i, 1);

      setFileLampiran(temp);
      setFileLampiranToAdd(tempToAdd);
      setFileLampiranToDelete(tempToDelete);
    }
  };

  const handleDelete = (eventId) => {
    deleteEvent(eventId).then(() => {
      getAllEvents(user.unit);
      handleCloseEventDialog();
      showSnackbar("success", "Kegiatan berhasil dihapus");
    });
  };

  // Delete Dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Other
  const handleClickEdit = () => {
    handleCloseEventDialog();
    setChangeDialog(true);
  };

  const handleClosingCheck = () => {
    if (!(openUploadDialog && !uploadSuccess)) {
      handleCloseEventDialog();
    }
  };

  return (
    <Dialog
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      open={openEventDialog}
      onClose={() => handleClosingCheck()}
      onExited={() => {
        if (changeDialog) {
          // Open edit dialog.
          setChangeDialog(false);
          handleOpenEditDialog();
        } else {
          // So that the states in this component is reset when the dialog is closed.
          handleSetUnmountEventDialog();
        }
      }}
      PaperComponent={fullScreen ? undefined : PaperComponent}
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      {eventDialogMode === "view" ? (
        <>
          <div className={classes.view_dialogTopDiv}>
            {user._id === author_id ? (
              <>
                <LightTooltip title="Sunting">
                  <IconButton
                    className={classes.dialogTopIconButtons}
                    onClick={() => {
                      handleClickEdit();
                    }}
                  >
                    <EditIcon className={classes.dialogTopIcons} />
                  </IconButton>
                </LightTooltip>
                <LightTooltip title="Hapus" style={{ marginRight: "24px" }}>
                  <IconButton
                    className={classes.dialogTopIconButtons}
                    onClick={() => {
                      handleOpenDeleteDialog();
                    }}
                  >
                    <DeleteIcon className={classes.dialogTopIcons} />
                  </IconButton>
                </LightTooltip>
              </>
            ) : null}
            <IconButton
              edge="end"
              className={classes.dialogTopIconButtons}
              onClick={() => {
                handleCloseEventDialog();
              }}
            >
              <CloseIcon className={classes.dialogTopIcons} />
            </IconButton>
          </div>
          <div className={classes.viewDialogBottomDiv}>
            <CustomDeleteDialog
              openDeleteDialog={openDeleteDialog}
              handleCloseDeleteDialog={handleCloseDeleteDialog}
              eventName={name}
              handleDelete={() => {
                handleDelete(selectedEventInfo._id);
              }}
            />
            <div className={classes.viewDialogScrollableDiv}>
              <Grid
                container
                direction="column"
                spacing="4"
                style={{ marginTop: "0", marginBottom: "0" }}
              >
                <Grid
                  item
                  xs={12}
                  style={{ paddingTop: "0", paddingBottom: "0" }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ wordBreak: "break-word" }}
                  >
                    <b>{name}</b>
                  </Typography>
                </Grid>
                {location && location.length > 0 ? (
                  <Grid item xs={12} style={{ paddingTop: "0" }}>
                    <Typography
                      className={classes.formLabels}
                      style={{ wordBreak: "break-word" }}
                    >
                      <LocationOnIcon className={classes.formIcons} />
                      {location}
                    </Typography>
                  </Grid>
                ) : null}
                <Grid item>
                  <Typography className={classes.formLabels}>
                    <TimerIcon className={classes.formIcons} />
                    {moment(start_date)
                      .locale("id")
                      .format("dddd, DD MMMM YYYY  ∙  HH:mm")}
                  </Typography>
                  <Typography
                    className={classes.formLabels}
                    style={{ marginTop: "8px" }}
                  >
                    <TimerOffIcon className={classes.formIcons} />
                    {moment(end_date)
                      .locale("id")
                      .format("dddd, DD MMMM YYYY  ∙  HH:mm")}
                  </Typography>
                </Grid>
                <Grid container item direction="row" alignItems="center">
                  <SupervisorAccountIcon className={classes.formIcons} />
                  <div className={classes.chips}>
                    {target_role.map((role) => (
                      <Chip
                        key={role}
                        className={`${classes.chip} ${classes.viewDialogChip}`}
                        label={roleConverter[role]}
                      />
                    ))}
                  </div>
                </Grid>
                {description && description.length > 0 ? (
                  <Grid item>
                    <Typography
                      align="justify"
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <CustomLinkify text={description} />
                    </Typography>
                  </Grid>
                ) : null}
                {fileLampiran && fileLampiran.length > 0 ? (
                  <Grid item container spacing={1}>
                    <FileAttachment
                      data={fileLampiran}
                      onPreviewFile={viewFileEvent}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={classes.create_edit_dialogTopDiv} id="drag-handle">
            <Hidden smDown>
              <IconButton edge="start" className={classes.dialogTopIconButtons}>
                <DragHandleIcon className={classes.dialogTopIcons} />
              </IconButton>
            </Hidden>
            <IconButton
              edge="end"
              className={classes.dialogTopIconButtons}
              style={
                openUploadDialog && !uploadSuccess
                  ? { visibility: "hidden" }
                  : undefined
              }
              onClick={() => {
                if (!(openUploadDialog && !uploadSuccess)) {
                  handleCloseEventDialog();
                }
              }}
            >
              <CloseIcon className={classes.dialogTopIcons} />
            </IconButton>
          </div>
          <DialogTitle disableTypography>
            <Typography variant="h5" gutterBottom>
              <b>
                {eventDialogMode === "create"
                  ? "Buat Kegiatan"
                  : "Sunting Kegiatan"}
              </b>
            </Typography>
            <Typography color="textSecondary">
              {eventDialogMode === "create"
                ? "Tambahkan keterangan untuk membuat kegiatan."
                : "Ganti keterangan untuk menyunting kegiatan."}
            </Typography>
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
            <CustomUploadDialog
              // handleWheel={handleUploadDialogWheel}
              openUploadDialog={openUploadDialog}
              handleUploadSuccess={handleCloseEventDialog}
              uploadSuccess={uploadSuccess}
              messageUploading={
                eventDialogMode === "create"
                  ? "Kegiatan sedang dibuat"
                  : "Kegiatan sedang disunting"
              }
              messageSuccess={
                eventDialogMode === "create"
                  ? "Kegiatan telah dibuat"
                  : "Kegiatan telah disunting"
              }
            />
            <div
              /* ref={uploadDialogScrollRef} */ className={
                classes.createEditDialogScrollableDiv
              }
            >
              <Grid container direction="column" spacing={4}>
                <Grid item>
                  <Typography
                    component="label"
                    for="name"
                    color="primary"
                    className={classes.formLabels}
                  >
                    <EventNoteIcon className={classes.formIcons} />
                    Judul
                  </Typography>
                  <TextField
                    id="name"
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Isi Judul"
                    value={name}
                    error={errors.name}
                    onChange={(e) => {
                      handleChangeName(e);
                    }}
                  />
                  {errors.name ? (
                    <div className={classes.zeroHeightHelperText}>
                      <FormHelperText error>{errors.name}</FormHelperText>
                    </div>
                  ) : null}
                </Grid>

                <Grid item>
                  <Typography
                    component="label"
                    for="location"
                    color="primary"
                    className={classes.formLabels}
                  >
                    <LocationOnIcon className={classes.formIcons} />
                    Lokasi
                  </Typography>
                  <TextField
                    id="location"
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Isi Lokasi"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                    }}
                  />
                </Grid>

                <Grid
                  item
                  container
                  spacing={2}
                  className={classes.mdUpZeroBottomPadding}
                >
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={classes.smDownZeroBottomPadding}
                  >
                    <Typography
                      component="label"
                      for="eventStart"
                      color="primary"
                      className={classes.formLabels}
                    >
                      <TimerIcon className={classes.formIcons} />
                      Waktu Mulai
                    </Typography>
                    <MuiPickersUtilsProvider
                      locale={lokal}
                      utils={DateFnsUtils}
                    >
                      <KeyboardDatePicker
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        disablePast
                        onChange={(date) => {
                          handleStartDateChange(date);
                        }}
                        open={openStartDatePicker}
                        onClose={() => {
                          setOpenStartDatePicker(false);
                        }}
                        style={{ display: "none" }}
                      />
                      <KeyboardDateTimePicker
                        id="eventStart"
                        inputRef={startDatePicker}
                        fullWidth
                        disablePast
                        inputVariant="outlined"
                        format={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy - HH:mm"}
                        ampm={false}
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        minDateMessage="Harus waktu yang akan datang"
                        invalidDateMessage="Format tanggal tidak benar"
                        value={start_date}
                        placeholder="Isi Waktu Mulai"
                        onChange={(date) => {
                          handleStartDateChange(date);
                        }}
                        helperText={null}
                        onError={(err) => {
                          if (errors.start_date_picker !== err) {
                            setErrors({ ...errors, start_date_picker: err });
                          }
                        }}
                        error={
                          errors.start_date_custom || errors.start_date_picker
                        }
                        open={openStartDateTimePicker}
                        onOpen={() => {
                          handleOpenStartPicker(isAllDay);
                        }}
                        onClose={() => {
                          handleCloseStartPicker(isAllDay);
                        }}
                      />
                      <div
                        className={classes.zeroHeightHelperText}
                        style={{ flexDirection: "column" }}
                      >
                        {errors.start_date_custom ? (
                          <FormHelperText error>
                            {errors.start_date_custom}
                          </FormHelperText>
                        ) : errors.start_date_picker ? (
                          <FormHelperText error>
                            {errors.start_date_picker}
                          </FormHelperText>
                        ) : null}
                        {/* checkbox ini dimasukkan ke div zero height ini agar dapat berpindah ke bawah (untuk memberikan ruang
                          untuk menampilkan helper text error) tanpa memindahkan dua item-item di bawahnya*/}
                        <FormGroup style={{ width: "fit-content" }}>
                          <FormControlLabel
                            label={
                              <Typography color="textSecondary">
                                Sepanjang Hari
                              </Typography>
                            }
                            control={
                              <Checkbox
                                onChange={() => {
                                  handleCheckAllDay();
                                }}
                                color="primary"
                                size="small"
                                checked={isAllDay}
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                      <Grid
                        item
                        style={{
                          padding: "0",
                          width: "0",
                          visibility: "hidden",
                        }}
                      >
                        <FormHelperText>{"\u200B"}</FormHelperText>
                        <Checkbox size="small" disabled />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    className={classes.smDownZeroTopPadding}
                  >
                    <Typography
                      component="label"
                      for="eventEnd"
                      color="primary"
                      className={classes.formLabels}
                    >
                      <TimerOffIcon className={classes.formIcons} />
                      Waktu Selesai
                    </Typography>
                    <MuiPickersUtilsProvider
                      locale={lokal}
                      utils={DateFnsUtils}
                    >
                      <KeyboardDatePicker
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        disablePast
                        minDate={start_date}
                        onChange={(date) => {
                          handleEndDateChange(date);
                        }}
                        open={openEndDatePicker}
                        onClose={() => setOpenEndDatePicker(false)}
                        style={{ display: "none" }}
                      />
                      <KeyboardDateTimePicker
                        id="eventEnd"
                        inputRef={endDatePicker}
                        fullWidth
                        disablePast
                        inputVariant="outlined"
                        format={isAllDay ? "dd/MM/yyyy" : "dd/MM/yyyy - HH:mm"}
                        ampm={false}
                        okLabel="Simpan"
                        cancelLabel="Batal"
                        minDate={start_date}
                        minDateMessage="Harus setelah Waktu Mulai"
                        invalidDateMessage="Format tanggal tidak benar"
                        value={end_date}
                        placeholder="Isi Waktu Selesai"
                        onChange={(date) => {
                          handleEndDateChange(date);
                        }}
                        helperText={null}
                        onError={(err) => {
                          if (errors.end_date_picker !== err) {
                            setErrors({ ...errors, end_date_picker: err });
                          }
                        }}
                        error={errors.end_date_custom || errors.end_date_picker}
                        open={openEndDateTimePicker}
                        onOpen={() => {
                          handleOpenEndPicker(isAllDay);
                        }}
                        onClose={() => {
                          handleCloseEndPicker(isAllDay);
                        }}
                      />
                      <div
                        className={classes.zeroHeightHelperText}
                        style={{ flexDirection: "column" }}
                      >
                        {errors.end_date_custom ? (
                          <FormHelperText error>
                            {errors.end_date_custom}
                          </FormHelperText>
                        ) : errors.end_date_picker ? (
                          <FormHelperText error>
                            {errors.end_date_picker}
                          </FormHelperText>
                        ) : null}
                      </div>
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>

                <Grid item className={classes.mdUpZeroTopPadding}>
                  <Typography
                    component="label"
                    for="target_role"
                    color="primary"
                    className={classes.formLabels}
                  >
                    <SupervisorAccountIcon className={classes.formIcons} />
                    Pihak Penerima
                  </Typography>
                  <FormControl variant="outlined" fullWidth error={errors.to}>
                    <Select
                      id="target_role"
                      multiple
                      displayEmpty
                      value={target_role}
                      onChange={(e) => {
                        handleChangeTargetRole(e);
                      }}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.length === 0 ? (
                            // input ini hanya digunakan sebagai placeholder
                            <Input
                              disableUnderline
                              placeholder="Pilih Pihak Penerima"
                              readOnly
                              classes={{ input: classes.dummyInput }}
                            />
                          ) : (
                            selected.map((role) => {
                              return (
                                <Chip
                                  key={role}
                                  className={classes.chip}
                                  label={roleConverter[role]}
                                />
                              );
                            })
                          )}
                        </div>
                      )}
                    >
                      {["Student", "Teacher", "Admin"].map((role) => (
                        <MenuItem key={role} value={role}>
                          <Checkbox
                            checked={target_role.includes(role)}
                            color="primary"
                          />
                          <ListItemText primary={roleConverter[role]} />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.to ? (
                      <div className={classes.zeroHeightHelperText}>
                        <FormHelperText error>{errors.to}</FormHelperText>
                      </div>
                    ) : null}
                  </FormControl>
                </Grid>

                <Grid item>
                  <Typography
                    component="label"
                    for="description"
                    color="primary"
                    className={classes.formLabels}
                  >
                    <SubjectIcon className={classes.formIcons} />
                    Deskripsi
                  </Typography>
                  <TextField
                    id="description"
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Isi Deskripsi"
                    multiline
                    value={description}
                    onChange={(e) => {
                      handleChangeDescription(e);
                    }}
                  />
                </Grid>

                <Grid item>
                  <input
                    id="file_control"
                    name="lampiran"
                    type="file"
                    accept="file/*"
                    multiple={true}
                    ref={lampiranUploader}
                    onChange={handleLampiranUpload}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AttachFileIcon />}
                    onClick={() => {
                      lampiranUploader.current.click();
                    }}
                    className={classes.addFileButton}
                  >
                    Tambah Lampiran Berkas
                  </Button>
                  <Grid container spacing={1} style={{ marginTop: "10px" }}>
                    {fileLampiran && fileLampiran.length > 0 ? (
                      <FileAttachment
                        data={fileLampiran}
                        handleLampiranDelete={handleLampiranDelete}
                      />
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            <Button
              variant="contained"
              className={
                eventDialogMode === "create"
                  ? classes.createEventButton
                  : classes.editEventButton
              }
              disabled={openUploadDialog}
              onClick={() => {
                eventDialogMode === "create"
                  ? handleCreateEvent()
                  : handleUpdateEvent();
              }}
            >
              {eventDialogMode === "create" ? "Buat" : "Sunting"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default Event;
