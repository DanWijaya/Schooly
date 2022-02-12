import React from "react";
import * as XLSX from "xlsx";
import { bulkRegisterUsers } from "../../actions/UserActions";
import { sendBulkRegistrationEmail } from "../../actions/EmailServiceActions";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    padding: "10px",
    background: "linear-gradient(#2196F3, #FFFFFF)",
    backgroundSize: "100% 300px",
    backgroundRepeat: "no-repeat",
  },
  registerButton: {
    width: "20%",
    marginTop: "15px",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  templateButton: {
    width: "20%",
    marginTop: "15px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function BulkRegister() {
  const cl = useStyles();

  const [users, setUsers] = React.useState([]);
  const [classes, setClasses] = React.useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    let headers = [];
    for (let key in users[0]) {
      headers.push(key);
    }

    let data = {
      users: users,
      classes: classes,
    };
    // bulkRegisterUsers(data).then((response) => {
    //   console.log(response);
    // });
    console.log(data);
    await bulkRegisterUsers(data);
    await sendBulkRegistrationEmail(data);
  };

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const workBook = XLSX.read(bufferArray, { type: "buffer" });

        //Kelas XIID sampai XIIG (10 - 13)
        let user_list = [];
        let class_list = [];
        // workSheetName nya itu nama kelasnya.
        const sheetLength = workBook.SheetNames.length;
        for (let i = 0; i < sheetLength; i++) {
          const workSheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workSheetName];
          let students = XLSX.utils.sheet_to_json(workSheet);

          class_list.push(workSheetName);

          students = students.map((d, idx) => {
            d.role = "Student";
            d.kelas = workSheetName;
            d.name = d["Nama"];
            d.email = d["Email"];
            d.phone = d["Nomor Telepon"];
            d.emergency_phone = d["Nomor Telepon Darurat"];
            d.address = d["Alamat"];

            return d;
          });
          user_list = user_list.concat(students);
        }

        // break;

        resolve({ users: user_list, classes: class_list });
      };

      fileReader.onerror = (err) => {
        reject(err);
      };
    });

    promise.then((d) => {
      setUsers(d.users);
      setClasses(d.classes);
    });
  };

  let headers = [];
  for (let key in users[0]) {
    headers.push(key);
  }

  const downloadBulkRegisterTemplate = async () => {
    const workbook = XLSX.utils.book_new();

    const data = [
      {
        Nama: "",
        Email: "",
        "Nomor Telepon": "",
        "Nomor Telepon Darurat": "",
        Alamat: "",
      },
    ];

    const exp = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, exp, "X A");

    var fileName = "TemplateDaftarMurid.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Grid container direction="column" alignItems="center">
          <input type="file" onChange={(e) => readExcel(e.target.files[0])} />
          <Button
            variant="contained"
            className={cl.templateButton}
            onClick={downloadBulkRegisterTemplate}
          >
            Download template
          </Button>
          {users.length > 0 ? (
            <Button
              type="submit"
              variant="contained"
              className={cl.registerButton}
            >
              Register In Bulk
            </Button>
          ) : null}
        </Grid>
        <table class="table container">
          <thead>
            <tr>
              {headers.map((h) => (
                <th sco="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((d) => (
              <tr key={d.name}>
                {headers.map((h) => (
                  <td>{d[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default BulkRegister;
