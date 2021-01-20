import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Button,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    top: "30px",
    width: "65%",
    margin: "auto",
    padding: "20px 0",
    backgroundColor: theme.palette.primary.main,
  },
  gridButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  button: {
    "&:focus, &:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
}));

export default function CSV() {
  const classes = useStyles();
  // const theme = useTheme();

  const [kontenCSV, setKontenCSV] = React.useState(""); // isi file csv disimpan di sini sebagai satu string panjang
  const [openTabelDialog, setOpenTabelDialog] = React.useState(false); // untuk menampilkan/menutup dialog yang berisi tabel
  const [openSuccessAlert, setOpenSuccessAlert] = React.useState(false); // untuk menampilkan/menutup alert ketika berhasil submit
  const [openErrorAlert, setOpenErrorAlert] = React.useState(false); // untuk menampilkan/menutup alert ketika pengguna belum memilih file saat men-submit

  const submitButton = React.createRef(null);
  const fileInput = React.createRef(null);

  const handleClickOpenDialog = (name) => {
    setOpenTabelDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenTabelDialog(false);
  };

  const handleCloseSuccessAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessAlert(false);
  };

  const handleCloseErrorAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorAlert(false);
  };

  const handleClickSubmit = () => {
    if (fileInput.current.files[0]) {
      submitButton.current.click();
      if (openErrorAlert) {
        setOpenErrorAlert(false);
      }
      setOpenSuccessAlert(true);
    } else {
      setOpenErrorAlert(true);
    }
  };

  const handleClickDownload = (data) => {
    if (data === "") {
      alert("Belum ada data yang di-submit");
    } else {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "file.csv");
      a.click();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // agar default action elemen HTML <form> tidak dilakukan(?)

    // ketika pengguna menekan tombol submit,  konten csv yang diupload pengguna akan disimpan di state 'kontenCSV'
    // (karena konten csv akan hilang saat form dirender ulang)
    fileInput.current.files[0]
      .text()
      .then((fileContent) => {
        setKontenCSV(fileContent);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showTable = () => {
    let element = (
      <Typography variant="h6" style={{ padding: "60px 0", margin: "auto" }}>
        File CSV belum dipilih
      </Typography>
    );

    if (kontenCSV) {
      // mem-parse konten file (yang sudah berupa teks) menjadi array dengan format : [{baris 1}, {baris 2}, ... ]
      // contoh [ {"id": "1", "nama": "Budi"} , {"id": "2", "nama": "Caca"} , ... ]
      // {} nya itu Map, bukan object

      // contoh isi 'kontenCSV' :
      // "id","nama"
      // "1", "Budi"
      // "2", "Caca"

      let strings = kontenCSV.split("\n"); // contoh isi 'strings' : [ '"id","nama"'  ,  '"1","Budi"', '"2","Caca"' , ...]
      let daftarNamaKolom = strings[0].split(","); // contoh isi 'daftarNamaKolom' : ["id", "nama"]
      let dataTabel = [];

      strings.slice(1).forEach((row) => {
        // karena strings[0] berisi nama-nama kolom, iterasinya dimulai dari index 1 sampai seterusnya
        let data = row.split(","); // contoh isi 'data' : ["1", "Budi"]
        let map = new Map(); // contoh isi 'map' : {"id": "1", "nama": "Budi"}  tapi {} nya itu Map, bukan object

        for (let idx = 0; idx < daftarNamaKolom.length; idx++) {
          map.set(daftarNamaKolom[idx], data[idx]);
        }

        dataTabel.push(map);
      });

      // contoh isi 'dataTabel' saat ini :
      // [ {"id": "1", "nama": "Budi"} , {"id": "2", "nama": "Caca"} , ... ] tapi {} nya itu Map, bukan object

      element = (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {daftarNamaKolom.map((namaKolom) => {
                  return <TableCell>{namaKolom}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTabel.map((baris) => (
                <TableRow>
                  {daftarNamaKolom.map((namaKolom) => {
                    return <TableCell>{baris.get(namaKolom)}</TableCell>;
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
  return (
    <div className={classes.root}>
      <Grid
        container
        style={{ margin: "auto", display: "flex", justifyContent: "center" }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={(event) => {
              handleSubmit(event);
            }}
            className={classes.form}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <label style={{ color: "black" }}>
              Pilih file CSV &nbsp;
              <input type="file" ref={fileInput} accept=".csv" />
              <Button className={classes.button}>
                {" "}
                <input type="file" ref={fileInput} accept=".csv" />{" "}
              </Button>
            </label>
            <button
              type="submit"
              ref={submitButton}
              style={{ display: "none" }}
            >
              Submit
            </button>
          </form>
        </Grid>
        <Grid container item xs={12} sm={4}>
          <Grid item xs={12} className={classes.gridButton}>
            <Button
              variant="contained"
              onClick={() => {
                handleClickSubmit();
              }}
              className={classes.button}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.gridButton}>
            <Button
              variant="contained"
              onClick={() => {
                handleClickOpenDialog();
              }}
              className={classes.button}
            >
              Lihat Isi
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                handleClickDownload(kontenCSV);
              }}
              className={classes.button}
            >
              Download/Export
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        fullWidth={true}
        maxWidth="sm"
        onClose={() => {
          handleCloseDialog();
        }}
        open={openTabelDialog}
      >
        {showTable()}
      </Dialog>

      <Snackbar
        open={openSuccessAlert}
        autoHideDuration={2000}
        onClose={(event, reason) => {
          handleCloseSuccessAlert(event, reason);
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={(event, reason) => {
            handleCloseSuccessAlert(event, reason);
          }}
          severity="success"
        >
          Isi CSV siap ditampilkan!
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={openErrorAlert}
        autoHideDuration={2000}
        onClose={(event, reason) => {
          handleCloseErrorAlert(event, reason);
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={(event, reason) => {
            handleCloseErrorAlert(event, reason);
          }}
          severity="error"
        >
          File CSV belum dipilih!
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
