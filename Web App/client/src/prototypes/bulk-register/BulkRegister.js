import React from "react"
import * as XLSX from 'xlsx';
import { bulkRegisterUsers } from "../../actions/UserActions";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button
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
    loginButton: {
      width: "20%",
      marginTop: "15px",
      backgroundColor: theme.palette.success.main,
      color: "white",
      "&:focus, &:hover": {
        backgroundColor: theme.palette.success.main,
        color: "white",
        }
    },
  }));

function BulkRegister() {

    const cl = useStyles();

    const [items, setItems] = React.useState([]);
    const [classes, setClasses] = React.useState([]);

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("Submit for register bulk")
        let headers = [];
        for(let key in items[0]){
            headers.push(key);
        }

        let data = {
            users: items,
            classes: classes
        }
        bulkRegisterUsers(data).then((response) => {
            console.log(response);
        });
    }

    const readExcel=(file) => {
        const promise = new Promise((resolve, reject) => {

            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const workBook = XLSX.read(bufferArray, {type: 'buffer'});

                //Kelas XIID sampai XIIG (10 - 13)
                let user_list = [];
                let class_list = []
                for(var i = 10; i < 14; i++){
                    // workSheetName nya itu nama kelasnya. 
                    const workSheetName = workBook.SheetNames[i];
                    const workSheet = workBook.Sheets[workSheetName];
                    let students = XLSX.utils.sheet_to_json(workSheet);

                    class_list.push(workSheetName);
                    
                    students = students.map((d, idx) => {
                        d.name = d.NAMA;
                        d.role = "Student";
                        d.email =  `murid${workSheetName.replace(/\s/g, "")}${idx+1}@gmail.com`.toLowerCase();
                        d.phone = "12341234";
                        d.emergency_phone = "911911";
                        d.address = "Jalan Contoh raya";
                        d.kelas = workSheetName;
                        d.password = `Murid${workSheetName.replace(/\s/g, "")}${idx+1}1234`;
                        d.password2 = `Murid${workSheetName.replace(/\s/g, "")}${idx+1}1234`;

                        delete d["NAMA"];
                        delete d["NO INDUK"];
    
                        /*
                        name: this.state.name,
                        role: this.state.role,
                        email: this.state.email.toLowerCase(),
                        phone: this.state.phone,
                        emergency_phone: this.state.emergency_phone,
                        address: this.state.address,
                        password: this.state.password,
                        password2: this.state.password2,
                        tanggal_lahir: this.state.tanggal_lahir,    
                        */
                        return d;
                    })
                    user_list = user_list.concat(students);
                    // break;
                }
                
                // tambahin data-data lainnya ke masing masing entry sebelum diresolve. 
                /*
                    Email: murid<nama-kelas-tanpa-spasi><no-sesuai-absen>@gmail.com 
                    Name: <sesuai-nama>
                    Role: Student
                    Phone: 12341234 (Atau buat optional)
                    Emergency_phone: 911911 (Atau buat optional)
                    Address: Jalan Contoh raya (Atau buat optional)
                    Password: Murid<nama-kelas-tanpa-spasi><no-sesuai-absen>1234
                    Password2: Murid<nama-kelas-tanpa-spasi><no-sesuai-absen>1234
                    Tanggal Lahir: 22 Agustus 2003 (Atau buat optional)
                    Kelas: <nama-kelas>
                */
                resolve({users: user_list, classes: class_list});
            };

            fileReader.onerror = (err) => {
                reject(err);
            }
        })

        promise.then((d) => {
            console.log(d);
            setItems(d.users);
            setClasses(d.classes);
        })
    }
    
    let headers = [];
    for(let key in items[0]){
        headers.push(key);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div style={{marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <input type="file" onChange={(e) => readExcel(e.target.files[0])}/>
                    {items.length > 0 ? 
                    <Button
                        type="submit"
                        variant="contained"
                        className={cl.loginButton}
                    >
                        Register In Bulk
                    </Button> : null }
                </div>
            <table class="table container">
                <thead>
                <tr>
                    {headers.map((h) => (<th sco="col">{h}</th>))}
                </tr>
                </thead>
                <tbody>
                {items.map((d) => (
                    <tr key={d.name}>
                        {headers.map((h) => (<td>{d[h]}</td>))}
                    </tr>
                ))}
                </tbody>
            </table>
            </form>
        </div>
    )
}

export default BulkRegister;
