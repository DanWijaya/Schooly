import React from "react"
import * as XLSX from 'xlsx';

function BulkRegister() {

    const [items, setItems] = React.useState([]);
    const onSubmit = (e) => {
        //for loop items 
        //registerBulk(d);
    }
    const readExcel=(file) => {
        const promise = new Promise((resolve, reject) => {

            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const workBook = XLSX.read(bufferArray, {type: 'buffer'});

                const workSheetName = workBook.SheetNames[10];
                const workSheet = workBook.Sheets[workSheetName];
                const data = XLSX.utils.sheet_to_json(workSheet);

                // tambahin data-data lainnya ke masing masing entry sebelum diresolve. 
                /*
                    Email: murid<nama-kelas-tanpa-spasi><no-sesuai-absen>@gmail.com 
                    Name: <sesuai-nama>
                    Role: Student
                    Phone: 12341234 (Atau buat optional)
                    Emergency_phone: 911911 (Atau buat optional)
                    Address: Jalan Contoh raya (Atau buat optional)
                    Password: Murid<nama-kelas-tanpa-spasi><no-sesuai-absen>1234
                    Password2: Murid<no-sesuai-absen>1234
                    Tanggal Lahir: 22 Agustus 2003 (Atau buat optional)
                    Kelas: <nama-kelas>
                */
                resolve(data);
            };

            fileReader.onerror = (err) => {
                reject(err);
            }
        })

        promise.then((d) => {
            console.log(d);
            setItems(d);
        })
    }
    return (
        <div>
            <button onSubmit={onSubmit}/>
            <input type="file" onChange={(e) => readExcel(e.target.files[0])}/>
            <table class="table container">
                <thead>
                <tr>
                    <th scope="col">Nama</th>
                    <th scope="col">NO INDUK</th>
                </tr>
                </thead>
                <tbody>
                {items.map((d) => (
                    <tr key={d.NAMA}>
                    <td>{d.NAMA}</td>
                    <td>{d["NO INDUK"]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default BulkRegister;
