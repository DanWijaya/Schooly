/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { FaFolder, FaStar, FaRegStar, FaFile, FaFilePdf, FaBars } from 'react-icons/fa';
import { convertDate } from './convertDate.js';
import { convertBytes } from './convertBytes.js';
import { Dropbox } from "dropbox";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@material-ui/core";

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
    convertDate(doc.client_modified),  doc['.tag'] !== "folder" ? path.extname(doc.name): "Folder", doc.path_display ))

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

	// const handleClickOutside = useCallback((e) => {
	// 	if (nodeDropdown.current.contains(e.target)) {
	// 		// inside click
	// 		return;
	// 	}
	// 	// outside click 
	// 	showDropDown(dropDown);
  // }, [showDropDown, dropDown]);
  
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover style={{cursor: "pointer"}} role="checkbox" tabIndex={-1} key={row.code} onClick={(event) => handleClickItem(event, row.type, row.path_display)}>
                  {columns.map((column) => {
                    const value = row[column.id];
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
                      <TableCell key={column.id} align={column.align} style={{width: width}}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
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
