/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FaFile, FaFolder, FaFileExcel, FaFileAlt, FaFileImage, FaFileWord, FaFilePdf, FaFilePowerpoint } from 'react-icons/fa';
import { convertBytes } from './convertBytes.js';
import { Dropbox } from "dropbox";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Avatar, ListItemAvatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import moment from "moment";
import "moment/locale/id";
// import Remove from "../Modals/Remove";
// import CopyMove from "../Modals/CopyMove";
import path from "path";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CustomizedMenu from "../CustomizedMenu";
import Delete from "../dialog/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  container: {
    maxHeight: "440px",
  },
  moreIcon: {
    opacity: "50%",
    "&:focus, &:hover": {
      opacity: "100%",
      color: theme.palette.primary.main,
    },
  },
  wordFileTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "#16B0DD",
  },
  excelFileTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "#68C74F",
  },
  imageFileTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "#974994",
  },
  pdfFileTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "#E43B37",
  },
  textFileTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "#F7BC24",
  },
  presentationFileTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "#FD931D",
  },
  folderTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "transparent",
    color: theme.palette.primary.main
  },
  otherFileTypeIcon: {
    marginRight: "10px",
    width: theme.spacing(2.25),
    height: theme.spacing(2.5),
    backgroundColor: "#654321",
  },
}));

const columns = [
  { id: 'name', label: 'Name'},
  { id: 'size', label: 'Ukuran'},
  {
    id: 'modified',
    label: 'Terakhir diubah',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'type',
    label: 'Tipe',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: "action",
    label: ""
  }
];

function createData(name, size, modified, type, path_display, action) {
  return { name, size, modified, type, path_display, action};
}


function FileList(props) {

  const [dropDown, updateDropDown] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
	const [showRemoveModal, updateRemoveModal] = useState(false);
	const [showRenameModal, updateRenameModal] = useState(false);
	const [showCopyModal, updateCopyModal] = useState(false);
	const [showMoveModal, updateMoveModal] = useState(false);
  // const [thumbnailUrl, updateThumbnailUrl] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [page, setPage] = React.useState(0);
  // this selectedDoc used to keep the document selected for further action.
  const [selectedDoc, setSelectedDoc] = useState(null);
  const classes = useStyles();
  const {page, setPage, allDocs, updatePath, getLinkToFile, searchFilter,
    renderToUpdate, handleOpenLoadingAlert, handleOpenSuccessAlert, setSuccessMessage, setLoadingMessage } = props;
  const { dropbox_token } = props.auth;

  const handleClickAction = (event,doc) => {
    event.stopPropagation()
    setSelectedDoc(doc)
    console.log(doc)
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAction = (event) => {
    event.stopPropagation()
    setAnchorEl(null);
    setSelectedDoc(null)
  };

  const handleDownloadFolder = () => {
    setLoadingMessage("Folder sedang diunduh, mohon tetap menunggu")
    handleOpenLoadingAlert()
    let dropbox = new Dropbox({ fetch: fetch, accessToken: dropbox_token });
    dropbox
      .filesDownloadZip({ path: selectedDoc.path_display})
      .then((res) => {
        let name = res.metadata.name;
        let blobUrl = window.URL.createObjectURL(res.fileBlob);
        const link = document.createElement("a");
        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = name;
        link.click()
        window.URL.revokeObjectURL(blobUrl);
        renderToUpdate(true)
        setSuccessMessage("Folder berhasil diunduh")
        })
      .catch((err) => console.log(err))
  }

  let menuItemList =
    [
      {
        text: "Bagikan",
        handleClick: function(){
          setAnchorEl(null)
        }
      },
      {
        text: "Hapus",
        handleClick: function(){
          setDeleteDialog(true)
          setAnchorEl(null)
        }
      },
      {
        text: "Unduh Folder",
        handleClick: function(){
          setAnchorEl(null)
          handleDownloadFolder()

        }
      }
  ]


  const rows = allDocs.map((doc) => {

    if(doc['.tag'] !== "folder"){
      menuItemList = [
        {
          text: "Bagikan",
          handleClick: function(){
            setAnchorEl(null)
          }
        },
        {
          text: "Hapus",
          handleClick: function(){
            setDeleteDialog(true)
            setAnchorEl(null)
          }
        },
      ]
    }
    return(
    createData(
    doc.name, doc['.tag'] !== "folder" ? convertBytes(doc.size) : "--",!doc.client_modified ? "--" : "Pukul" + moment(doc.client_modified).format(" HH.mm, DD-MM-YYYY"),
    doc['.tag'] !== "folder" ? fileType(doc.name): "Folder", doc.path_display,
     <div>
      <MoreHorizIcon onClick={(e) => handleClickAction(e,doc)} className={classes.moreIcon}/>
      {selectedDoc ? doc.path_display === selectedDoc.path_display ?
      <CustomizedMenu
      menuItemList={menuItemList}
      handleClose={handleCloseAction}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}/> : null : null}
    </div> ))
  }
    )




  const handleClickItem = (event, file_tag, file_path) => {
    if(file_tag === "Folder"){
      updatePath(file_path)
    } else {
      getLinkToFile(file_path)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const showDropDown = useCallback(() => {
		updateDropDown(dropDown ? false : true);
	}, [dropDown]);

	const handleDeleteModal = () => {
		updateRemoveModal(true);
	}

	const handleRenameModal = () => {
		updateRenameModal(true);
	}

	const handleCopyModal = () => {
		updateCopyModal(true);
	}

	const handleMoveModal = () => {
		updateMoveModal(true);
	}


  function fileType(filename) {
    let ext_file = path.extname(filename)
    switch(ext_file) {
      case ".docx" : return "Word"
      case ".xlsx" :
      case ".csv"  : return "Excel"

      case ".png" :
      case ".jpg" :
      case ".jpeg" : return "Gambar"

      case ".pdf" : return "PDF"

      case ".txt" :
      case ".rtf" : return "Teks"

      case ".ppt" :
      case ".pptx" : return "Presentasi"

      default: return "File Lainnya"
    }
  }

  function fileIcon(filename, type) {
    let ext_file = path.extname(filename)
    if(type === "Folder")
      return(
      <Avatar variant="rounded" className={classes.folderTypeIcon}>
        <FaFolder />
      </Avatar>)
    else{
    switch(ext_file) {
      case ".docx" :
        return(
        <Avatar variant="rounded" className={classes.wordFileTypeIcon}>
          <FaFileWord />
        </Avatar>)

      case ".xlsx" :
      case ".csv"  :
        return(
        <Avatar variant="rounded" className={classes.excelFileTypeIcon}>
         <FaFileExcel />
        </Avatar>)

      case ".png" :
      case ".jpg" :
      case ".jpeg" :
        return (
          <Avatar variant="rounded" className={classes.imageFileTypeIcon}>
            <FaFileImage />
          </Avatar>
          )

      case ".pdf" :
        return(
          <Avatar variant="rounded" className={classes.pdfFileTypeIcon}>
            <FaFilePdf/>
          </Avatar>
          )

      case ".txt" :
      case ".rtf" :
        return (
          <Avatar variant="rounded" className={classes.textFileTypeIcon}>
            <FaFileAlt />
          </Avatar>
        )

      case ".ppt" :
      case ".pptx" :
        return (
          <Avatar variant="rounded" className={classes.presentationFileTypeIcon}>
            <FaFilePowerpoint />
          </Avatar>
          )

      default: return (
      <Avatar variant="rounded" className={classes.otherFileTypeIcon}>
        <FaFile />
      </Avatar>)
    }
  }


  }

  console.log(rows)
  return (
    <Paper className={classes.root}>
      <Delete
      handleOpenSuccessAlert={handleOpenSuccessAlert}
      handleOpenLoadingAlert={handleOpenLoadingAlert}
      doc={selectedDoc}
      open={deleteDialog}
      handleOpen={setDeleteDialog}
      renderToUpdate={renderToUpdate}
      setLoadingMessage={setLoadingMessage}
      setSuccessMessage={setSuccessMessage}/>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                let width;
                switch(column.id){
                  case "name":
                    width= "50%"
                    break

                  case "size":
                    width = "5%"
                    break

                  case "modified":
                    width = "25%"
                    break

                  case "type":
                    width = "20%"
                    break

                  default:
                    break
                }

                return (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: width }}
                >
                  {column.label}
                </TableCell>
              )})}
            </TableRow>
          </TableHead>
          <TableBody>
          <ListItemAvatar>
        </ListItemAvatar>
            {rows.filter(row => row.name.toLowerCase().includes(searchFilter.toLowerCase()))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
              return (
                <TableRow hover style={{cursor: "pointer"}} role="checkbox" tabIndex={-1} key={row.code} onClick={(event) => handleClickItem(event, row.type, row.path_display)}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    let width;
                    let icon=null;

                    switch(column.id){
                      case "name":
                        width= "50%"
                        icon=fileIcon(row.name, row.type)
                        break

                      case "size":
                        width = "20%"
                        break

                      case "modified":
                        width = "20%"
                        break

                      case "type":
                        width = "10%"
                        break

                      default:
                        break
                    }
                    return (
                      <TableCell key={column.id} align={column.align} style={{width: width}}>
                        <Typography style={{display: "flex", flexDirection:"row", alignItems:"center"}}>
                          {icon}
                          {value}
                        </Typography>
                        {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                      </TableCell>
                    );
                  })}
                </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

FileList.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
})

export default connect(
  mapStateToProps
)(FileList);

// export default React.memo(FileList);
