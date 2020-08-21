import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/id";
import { setUserDisabled, getStudents, getTeachers, deleteUser } from "../actions/UserActions";
import LightTooltip  from "../components/misc/light-tooltip/LightTooltip";
import {Avatar, Button, IconButton, Dialog, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
   Grid, Hidden, ListItemAvatar, Menu, MenuItem, TableSortLabel, Toolbar, Typography,
   TableContainer, Table, TableHead , TableBody, TableRow, TableCell } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SortIcon from "@material-ui/icons/Sort";
import BlockIcon from '@material-ui/icons/Block';
import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded';
import LocalLibraryRoundedIcon from '@material-ui/icons/LocalLibraryRounded';

// tugas 3 -------------------------------------------
import { importUsers } from "./MockActions";
// import csv from 'csv-parser';
// import { Readable } from "stream";
import csv from 'csvtojson';
// -----------------------------------------------------

import ImportExportIcon from '@material-ui/icons/ImportExport';
import PublishIcon from '@material-ui/icons/PublishRounded';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';
import { List, ListItem } from '@material-ui/core';

// const csv = require("csv-parser")

// Source of the tables codes are from here : https://material-ui.com/components/tables/
function createData(_id, avatar, name, email, phone, emergency_phone, tanggal_lahir, address, action) {
  return { _id, avatar, name, email, phone, emergency_phone, tanggal_lahir, address, action };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}



function ManageUsersToolbar(props) {
  const { classes, order, orderBy, onRequestSort, role, heading } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property, role);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Nama" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    { id: "phone", numeric: true, disablePadding: false, label: "Nomor Telepon" },
    { id: "tanggal_lahir", numeric: false, disablePadding: false, label: "Tanggal Lahir" },
    { id: "address", numeric: false, disablePadding: false, label: "Alamat" },
    { id: "emergency_phone", numeric: false, disablePadding: false, label: "Nomor Telepon Darurat"}
  ];

  // Sort Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar className={classes.toolbar}>
      <div>
        <Typography variant="h5">
          {heading}
        </Typography>
      </div>
        <div style={{marginRight:'7px'}}>
          <LightTooltip title="Urutkan Akun">
            <IconButton onClick={handleOpenSortMenu} className={classes.sortButton}>
              <SortIcon />
            </IconButton>
          </LightTooltip>
          <Menu
            keepMounted
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseSortMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {headCells.map((headCell, i) => (
              <MenuItem
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
                onClick={props.handleClosePanel}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ?
                    <span className={classes.visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </span>
                    : null
                  }
                </TableSortLabel>
              </MenuItem>
            ))}
          </Menu>
       
        </div>
    </Toolbar>
    
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: "20px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px",
    
  },
  profileDeleteButton: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.error.dark,
    },
  },
  profileDisableButton: {
    backgroundColor: theme.palette.warning.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: "white",
      color: theme.palette.warning.dark,
    },
  },
  dialogBox: {
    maxWidth: "350px",
    padding: "15px",
  },
  dialogDisableButton: {
    width: "150px",
    backgroundColor: theme.palette.warning.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.warning.dark,
      color: "white",
    },
  },
  dialogDeleteButton: {
    width: "150px",
    backgroundColor: theme.palette.error.dark,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.error.dark,
      color: "white",
    },
  },
  dialogCancelButton: {
    width: "150px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  sortButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  importButton: {
    backgroundColor: "#50c878",
    color: "white",
    "&:hover": {
      backgroundColor: "#A2F7B5",
      color: "#309B94",
    },
    "&:focus":{
      backgroundColor: "#50c878",
      color: "white",
      "&:hover": {
        backgroundColor: "#A2F7B5",
        color: "#309B94",
    },
     
  }},
  closeButton: {
    color: "black",
    "&:hover": {
      backgroundColor:'#c21807',
      color: "white",
    },
    "&:focus":{
      color: "white"
    } },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  profilePanelDivider: {
    backgroundColor: theme.palette.primary.main,
  },
  profilePanelSummary: {
    "&:hover": {
      backgroundColor: theme.palette.button.main,
    },
  }
}));

function ManageUsers(props) {
  document.title = "Schooly | Daftar Pengguna"

  const classes = useStyles();

  const [order_student, setOrderStudent] = React.useState("asc");
  const [order_teacher, setOrderTeacher] = React.useState("asc");

  const [orderBy_student, setOrderByStudent] = React.useState("name");
  const [orderBy_teacher, setOrderByTeacher] = React.useState("name");

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);
  const [openDisableDialog, setOpenDisableDialog] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null)
  const [selectedUserName, setSelectedUserName] = React.useState(null);

  const { importUsers, setUserDisabled, deleteUser, getTeachers, getStudents } = props;
  const { all_students, all_teachers, pending_users } = props.auth;

  let student_rows = []
  let teacher_rows = []

  const userRowItem = (data) => {
    let temp = createData(
      data._id,
      data.avatar,
      data.name,
      data.email,
      data.phone,
      data.emergency_phone,
      data.tanggal_lahir,
      data.address
    )
    if (data.role === "Student") {
      student_rows.push(temp)
    }
    else if (data.role === "Teacher") {
      teacher_rows.push(temp)
    }
  }

  React.useEffect(() => {
    getStudents()
    getTeachers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retrieveUsers = () => {
    student_rows = []
    teacher_rows = []
    if(Array.isArray(all_students)){
      all_students.map((data) => userRowItem(data, "Student"))
    }
    if(Array.isArray(all_teachers)){
      all_teachers.map((data) => userRowItem(data, "Teacher"))
    }
  }

  const handleRequestSort = (event, property, role) => {
    if (role === "Student") {
      const isAsc = orderBy_student === property && order_student === "asc";
      setOrderStudent(isAsc ? "desc" : "asc");
      setOrderByStudent(property);
    }
    else if (role === "Teacher") {
      const isAsc = orderBy_teacher === property && order_teacher === "asc";
      setOrderTeacher(isAsc ? "desc" : "asc");
      setOrderByTeacher(property);
    }
  };

  // Call the function to get the classes from DB
  // this function is defined above
  retrieveUsers()


  // Tugas 3 ------------------------------------------------------------------------------------------
  const [userObjects, setUserObjects] = React.useState({header: [], content: []});
  const [openTabelDialog, setOpenTabelDialog] = React.useState(false);
  const fileInput = React.createRef(null);
  const [downloadfile, setDownloadFile] = React.useState("")
 
  // Fitur Download/Export==================================
  const prepareDownload = (array_of_users) => {

    let string = "id,avatar,name,email,phone,emergency_phone,tanggal_lahir,address\n"
    for(let individual_user of array_of_users){
      string+=`${individual_user._id},`
      string+=`${individual_user.avatar},`
      string+=`${individual_user.name},`
      string+=`${individual_user.email},`
      string+=`${individual_user.phone},`
      string+=`${individual_user.emergency_phone},`
      string+=`${individual_user.tanggal_lahir},`
      string+=`${individual_user.address}`
      string+="\n"
    }
    return(string)
  }

  const handleClickDownload = (data) => {
		if(data==""){
			alert("Belum ada data yang di-submit");
		}
		else {
			const blob = new Blob([data],{ type : 'text/csv'});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.setAttribute('hidden','')
			a.setAttribute('href',url)
			a.setAttribute('download','file.csv')
			// document.body.appendChild(a);
			a.click();
      // document.body.removeChild(a);
		}
  };
  
  const downloadcsv = (user) => {
    let chosen_user = prepareDownload(user)
    handleClickDownload(chosen_user)
  }

  
  // ======================================================

  // Dialog Import/Export
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (value) => {
    setOpen(false);
  };

  const onClickImportButton = () => {
    fileInput.current.click();
    setOpen(false);
  };

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handleOpenSortMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleCloseSortMenu = () => {
  //   setAnchorEl(null);
  // };

  const onInputChange = (event) => {
    event.preventDefault();

		fileInput.current.files[0].text().then((fileContent) => {
        let newUserObjects = {header: null, content: null};
        csv()
        .fromString(fileContent)
        .then((jsonObj) => {
          newUserObjects.content = jsonObj;
          console.log(jsonObj);
          return newUserObjects;
        })
        .then((newUserObjects) => {
          csv()
          .fromString(fileContent)
          .on('header', (header)=>{
            newUserObjects.header = header;
            console.log(header);
          })
          .on('done', () => {
            setUserObjects(newUserObjects);
          })
        })
    }).catch((err) => {
			console.log(err);
    });

    setOpenTabelDialog(true);
  };

  const onClickCancelImport = () => {
    setOpenTabelDialog(false);
    fileInput.current.value = ''; //supaya onchange pasti dipanggil
  };

  const onClickSubmitImport = () => {
    importUsers(userObjects); 
    setOpenTabelDialog(false);
    fileInput.current.value = '';
  };

  function SimpleDialog(props) {
    const { onClose, open } = props;

    const handleClose = () => {
      onClose();
    };

    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth='xs' fullWidth={true}>
        <div style={{display:"flex",justifyContent:'space-between'}}>
          <Typography style={{display:'flex', justifyContent:'center', fontSize:20,margin:'17px'}}>Import/Export CSV Data Pengguna</Typography>
          <IconButton className={classes.closeButton} onClick={onClose} style={{margin:'10px'}}>
                <CloseIcon onClick={onClose} />
          </IconButton>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end',marginTop:'20px',margin:'17px'}}>
            <Button variant="contained" onClick={() => {onClickImportButton()}} style={{backgroundColor:'#2E8B57',marginRight:'5px',color:'white'}} >
              <PublishIcon/>
              <Typography style={{marginLeft:'5px'}}>Import</Typography>
            </Button>
            <Button variant="contained" style={{backgroundColor:'#c21807',color:'white'}} onClick={() => {handleClickOpenUser()}}>
              <GetAppRoundedIcon/>
              <Typography style={{marginLeft:'5px'}}>Export</Typography>
            </Button>
        </div>
      </Dialog>
    );
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  // Dialog Pilihan User =========================================

  const [openUser, setOpenUser] = React.useState(false);

  const handleClickOpenUser = () => {
    setOpenUser(true)
  }

  const handleCloseUser = (value) => {
    setOpenUser(false);
  };
  function DialogPilihDownload(props) {
    const { onClose, open } = props;

    const handleCloseUser = () => {
      onClose();
    };

    return (
      <Dialog onClose={handleCloseUser} aria-labelledby="user-dialog-title" open={openUser} maxWidth='sm' fullWidth={true}>
        
        <div style={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',margin:'18px'}}>
            <GetAppRoundedIcon style={{backgroundColor:'#c21807',color:'white',borderRadius:100,display:'flex',alignItems:'center',justifyContent:'center'}}/>
            <Typography style={{fontSize:20,marginLeft:'10px'}}>Pilih Jenis User Untuk di-Export</Typography>
          </div>
          <div style={{margin:'12px'}}>
            <IconButton className={classes.closeButton} onClick={onClose}>
              <CloseIcon onClick={onClose} />
            </IconButton>
          </div>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end',marginTop:'20px',margin:'17px'}}>
            <Button variant="contained" onClick={() => {downloadcsv(all_students)}} style={{backgroundColor:'#621940',marginRight:'5px',color:'white'}} >
              <SchoolRoundedIcon/>
              <Typography style={{marginLeft:'5px'}}>Siswa</Typography>
            </Button>
            <Button variant="contained" style={{backgroundColor:'#0b032d',color:'white'}} onClick={() => {downloadcsv(all_teachers)}}>
              <LocalLibraryRoundedIcon/>
              <Typography style={{marginLeft:'5px'}}>Guru</Typography>
            </Button>
        </div>
      </Dialog>
    );
  }

  DialogPilihDownload.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  // ==================================================

  function previewTable() {
    let element = null;
		if (userObjects) {
      
			element = (
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								{userObjects.header.map((namaKolom) => {
									return (<TableCell>{namaKolom}</TableCell>);									
								})}
							</TableRow>
						</TableHead>
						<TableBody>
						{userObjects.content.map((baris) => (
							<TableRow>
								{userObjects.header.map((namaKolom) => {
									return (<TableCell>{baris[namaKolom]}</TableCell>);
								})}
							</TableRow>
						))}
						</TableBody>
					</Table>
				</TableContainer>
			);
		}

		return element;
  };
  // ------------------------------------------------------------------------------------------

  const onDeleteUser = (id) => {
    deleteUser(id)
  }
  const onDisableUser = (id) => {
    setUserDisabled(id)
  }
  // Delete Dialog box
  const handleOpenDeleteDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
    setSelectedUserId(id)
    setSelectedUserName(name)
  };

  const handleOpenDisableDialog = (e, id, name) => {
    e.stopPropagation();
    setOpenDisableDialog(true);
    setSelectedUserId(id)
    setSelectedUserName(name)
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseDisableDialog = () => {
    setOpenDisableDialog(false);
  };

  function DeleteDialog() {
    return (
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseDeleteDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Hapus Pengguna berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedUserName}</b>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{marginBottom: "10px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onDeleteUser(selectedUserId) }}
                startIcon={<DeleteOutlineIcon />}
                className={classes.dialogDeleteButton}
              >
                Hapus
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDeleteDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    )
  }

  function DisableDialog() {
    return (
      <Dialog
        open={openDisableDialog}
        onClose={handleCloseDisableDialog}
      >
        <Grid container direction="column" alignItems="center" className={classes.dialogBox}>
          <Grid item container justify="flex-end" alignItems="flex-start">
            <IconButton
              size="small"
              onClick={handleCloseDisableDialog}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h5" gutterBottom>
              Nonaktifkan pengguna berikut?
            </Typography>
          </Grid>
          <Grid item container justify="center" style={{marginBottom: "20px"}}>
            <Typography variant="h6" align="center" gutterBottom>
              <b>{selectedUserName}</b>
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            style={{marginBottom: "10px"}}
          >
            <Grid item>
              <Button
                onClick={() => { onDisableUser(selectedUserId) }}
                startIcon={<BlockIcon />}
                className={classes.dialogDisableButton}
              >
                Nonaktifkan
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleCloseDisableDialog}
                startIcon={< CancelIcon/>}
                className={classes.dialogCancelButton}
              >
                Batal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    )
  }

  console.log(pending_users)
  return (
    <div className={classes.root}>
      {DisableDialog()}
      {DeleteDialog()}
      <Typography variant="h4" align="center" gutterBottom>
        Daftar Pengguna Aktif
      </Typography>

      {/* tugas 3 ----------------------------------------------- */}
      <input type="file" ref={fileInput} accept=".csv" onChange={(event) => {onInputChange(event)}} style={{display:'none'}} />
      
      {/* <LightTooltip title="Import CSV">
        <IconButton className={classes.sortButton} variant="contained" onClick={() => {onClickImportButton()}}>
            <ImportExportIcon variant="contained" ref={fileInput} />
        </IconButton>
      </LightTooltip> */}
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:'6px',marginBottom:'10px'}}>
        <LightTooltip title="Import/Export CSV">
          <IconButton className={classes.importButton} onClick={() => handleClickOpen()}>
              <ImportExportIcon />  
          </IconButton>
        </LightTooltip>
        <SimpleDialog open={open} onClose={handleClose}/>
        <DialogPilihDownload open={openUser} onClose={handleCloseUser}/>
      </div>
      <Dialog fullWidth={true} maxWidth="sm" open={openTabelDialog}>
				{previewTable()}
        <Button variant="contained" onClick={() => {onClickSubmitImport()}}>Confirm</Button>
        <Button variant="contained" onClick={()=> {onClickCancelImport()}}>Cancel</Button>
			</Dialog>
      {/* ----------------------------------------------- */}

      <Divider className={classes.titleDivider} />
      <ManageUsersToolbar
        heading="Daftar Murid"
        role="Student"
        deleteUser={deleteUser}
        classes={classes}
        order={order_student}
        orderBy={orderBy_student}
        onRequestSort={handleRequestSort}
        rowCount={student_rows ? student_rows.length : 0}
      />
      <Divider variant="inset" />
      <Grid container direction="column" spacing={2} style={{marginTop: "10px", marginBottom: "75px"}}>
        {stableSort(student_rows, getComparator(order_student, orderBy_student))
          .map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <Grid item>
                <ExpansionPanel
                  button
                  variant="outlined"
                >
                  <ExpansionPanelSummary className={classes.profilePanelSummary}>
                    <Grid container spacing={1} justify="space-between" alignItems="center">
                      <Grid item>
                        {!row.avatar ?
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                        :
                          <ListItemAvatar>
                            <Avatar src={`/api/upload/avatar/${row.avatar}`}/>
                          </ListItemAvatar>
                        }
                      </Grid>
                      <Grid item>
                        <Hidden smUp implementation="css">
                          <Typography variant="subtitle1" id={labelId}>
                            {row.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {row.email}
                          </Typography>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                          <Typography variant="h6" id={labelId}>
                            {row.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {row.email}
                          </Typography>
                        </Hidden>
                      </Grid>
                      <Grid item xs container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Nonaktifkan">
                            <IconButton
                              size="small"
                              style={{display: "none"}}
                              className={classes.profileDisableButton}
                              onClick={(e) =>{handleOpenDisableDialog(e, row._id, row.name)}}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Hapus">
                            <IconButton
                              size="small"
                              className={classes.profileDeleteButton}
                              onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.name)}}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider className={classes.profilePanelDivider} />
                  <ExpansionPanelDetails>
                    <Grid conntainer direction="column">
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak:</b> {row.phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak Darurat:</b> {row.emergency_phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Alamat:</b> {row.address}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Tanggal lahir:</b> {moment(row.tanggal_lahir).locale("id").format("DD MMMM YYYY")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            )
          })}
      </Grid>
      <ManageUsersToolbar
        heading="Daftar Guru"
        role="Teacher"
        deleteUser={deleteUser}
        classes={classes}
        order={order_teacher}
        orderBy={orderBy_teacher}
        onRequestSort={handleRequestSort}
        rowCount={student_rows ? student_rows.length : 0}
      />
      <Divider variant="inset" />
      <Grid container direction="column" spacing={2} style={{marginTop: "10px"}}>
        {stableSort(teacher_rows, getComparator(order_teacher, orderBy_teacher))
          .map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <Grid item>
                <ExpansionPanel
                  button
                  variant="outlined"
                >
                  <ExpansionPanelSummary className={classes.profilePanelSummary}>
                    <Grid container spacing={1} justify="space-between" alignItems="center">
                      <Grid item>
                        {!row.avatar ?
                          <ListItemAvatar>
                            <Avatar />
                          </ListItemAvatar>
                        :
                          <ListItemAvatar>
                            <Avatar src={`/api/upload/avatar/${row.avatar}`}/>
                          </ListItemAvatar>
                        }
                      </Grid>
                      <Grid item>
                        <Hidden smUp implementation="css">
                          <Typography variant="subtitle1" id={labelId}>
                            {row.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {row.email}
                          </Typography>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                          <Typography variant="h6" id={labelId}>
                            {row.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {row.email}
                          </Typography>
                        </Hidden>
                      </Grid>
                      <Grid item xs container spacing={1} justify="flex-end">
                        <Grid item>
                          <LightTooltip title="Nonaktifkan">
                            <IconButton
                              style={{display: "none"}}
                              size="small"
                              className={classes.profileDisableButton}
                              onClick={(e) =>{handleOpenDisableDialog(e, row._id, row.name)}}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                        <Grid item>
                          <LightTooltip title="Hapus">
                            <IconButton
                              size="small"
                              className={classes.profileDeleteButton}
                              onClick={(e) =>{handleOpenDeleteDialog(e, row._id, row.name)}}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </LightTooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanelSummary>
                  <Divider className={classes.profilePanelDivider} />
                  <ExpansionPanelDetails>
                    <Grid conntainer direction="column">
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak:</b> {row.phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Kontak Darurat:</b> {row.emergency_phone}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Alamat:</b> {row.address}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" gutterBottom>
                          <b>Tanggal lahir:</b> {moment(row.tanggal_lahir).locale("id").format("DD MMMM YYYY")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            )
          })}
      </Grid>
    </div>
  );
}



const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
  classesCollection: state.classesCollection,
})

export default connect(
  mapStateToProps, { importUsers, setUserDisabled, getStudents, getTeachers, deleteUser }
) (ManageUsers);
