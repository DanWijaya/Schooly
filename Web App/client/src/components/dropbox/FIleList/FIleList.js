/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { FaFolder, FaFileExcel, FaFileAlt,FaFileImage, FaFileWord, FaFilePdf,FaFilePowerpoint } from 'react-icons/fa';
import { convertDate } from './convertDate.js';
import { convertBytes } from './convertBytes.js';
import { Dropbox } from "dropbox";
import { Avatar, ListItemAvatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography} from "@material-ui/core";

// import Remove from "../Modals/Remove";
// import CopyMove from "../Modals/CopyMove";
const path = require("path");

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "1000px",
    padding: "10px",
  },
  container: {
    maxHeight: 440
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
    backgroundColor: "#808080",
  },
}));

const columns = [
  { id: 'name', label: 'Name'},
  { id: 'size', label: 'Ukuran File'},
  {
    id: 'modified',
    label: 'Terakhir diubah',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'type',
    label: 'Tipe File',
    format: (value) => value.toLocaleString('en-US'),
  },
];

function createData(name, size, modified, type, path_display) {
  return { name, size, modified, type, path_display };
}

function FileList(props) {

  const [dropDown, updateDropDown] = useState(false);
	const [showRemoveModal, updateRemoveModal] = useState(false);
	const [showRenameModal, updateRenameModal] = useState(false);
	const [showCopyModal, updateCopyModal] = useState(false);
	const [showMoveModal, updateMoveModal] = useState(false);
  const [thumbnailUrl, updateThumbnailUrl] = useState(null);
  
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const {allDocs, updatePath, getLinkToFile } = props;

  const rows = allDocs.map((doc) => createData(doc.name, 
    doc['.tag'] !== "folder" ? convertBytes(doc.size) : "--", 
    convertDate(doc.client_modified),  doc['.tag'] !== "folder" ? fileType(doc.name): "Folder", doc.path_display ))

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

	const handleRemoveModal = () => {
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
  
      default: return null
    }
  }
  
    
  }

  console.log(rows)
  return (
    <Paper className={classes.root}>
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

            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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

export default React.memo(FileList);
