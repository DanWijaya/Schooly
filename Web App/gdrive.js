const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
// const axios = require('axios').default;
const { performance } = require('perf_hooks'); // ---buat ngitung lama upload---

const path = "env.json";
const {clientId, clientSecret, folderId, testFileName, testFileType, testFilePath, storedTokens } = JSON.parse(fs.readFileSync(path));

// ditentuin di developer console
const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.file'
];

// didapat dari developer console
let redirectURI = "http://localhost:3000";
// const oAuth2Client = new google.auth.OAuth2(
//   clientId,
//   clientSecret,
//   redirectURI
// );

function createFolder(auth) {
  // sumber kode: https://developers.google.com/drive/api/v3/folder#create_a_folder
  const drive = google.drive({ version: 'v3', auth });

  var fileMetadata = {
    'name': 'testfolder', // *** (opsional, ga harus diganti) nama folder yang dibuat ***
    'mimeType': 'application/vnd.google-apps.folder'
  };

  drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  }, function (err, folder) {
    if (err) {
      console.error(err);
    } else {
      console.log('Folder Id: ', folder.data.id); // *** copy id folder ini, trus paste sebagai value variabel folderId di fungsi uploadFile() ***
    }
  });
}

function clientUploadFile(auth) {
  // sumber kode: https://developers.google.com/drive/api/v3/folder#create_a_file_in_a_folder
  const drive = google.drive({ version: 'v3', auth });

  let metadata = {
    name: testFileName, // *** (opsional, ga harus diganti) nama file ketika sudah diupload ***
    parents: [folderId] // *** ganti dengan folder id yang diperoleh dengan menjalankan fungsi createFolder() ***
  };

  let media = {
    mimeType: testFileType, // *** ganti sesuai tipe file yang diupload ***
    body: fs.createReadStream(testFilePath) // *** ganti dengan path file yang akan diupload ***
  };

  // drive.files.create() adalah promise.
  // promise ini direturn agar waktu yang diperlukan untuk melakukan semua upload bisa dihitung 
  return drive.files.create({
    resource: metadata,
    media: media,
    fields: 'id'
  })
}

function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  return drive.files.list({
    pageSize: 10,
    spaces: 'drive',
    fields: 'nextPageToken, files(id, name), files/parents',
  }).then((res) => {
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.forEach((file) => {
          console.log(`${file.name} : ${file.parents ? file.parents.length : 0}`);
      });
    } else {
      console.log('No files found.');
    }
  })
}

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// mendapatkan URL halaman login
// const authUrl = oAuth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: SCOPES,
// });
// console.log('Untuk mendapatkan auth code, buka URL ini di browser:\n\n' + authUrl + '\n\n');


// rl.question('Jika token sudah disalin di gdrive.js, masukkan "t". \r\nJika belum, masukkan "c <query param bagian \'code\' di url abis redirect>" untuk menampilkan token di terminal: ', (code) => {
//   rl.close();
  // let type = code.split(" ")[0];
  // let content = code.split(" ")[1];
  let type = "t";

  if (type === "t") {
    // ini untuk membuat folder. biar ga berantakan, file-file yang diupload nanti dimasukan ke folder yang dibuat ini
    // createFolder(oAuth2Client);

    // ------------------------ tes upload file dalam jumlah banyak ------------------------ 
    let jumlahFile = 100;
    let uploads =  [];
    let refreshTokenList = [storedTokens.refresh_token];

    function getRandomIntInclusive(min, max) {
      // mengembalikan bilangan acak x antara bilangan min dan max (min <= x <= max)
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const pushFiles = (auth, id, iterator, ms) => {
      // arr.push(uploadFile(oAuth2Client).then(() => {

      // ----1. dengan waktu tunggu exponential----  
      // return clientUploadFile(auth).catch((err) => {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve()
      //     }, ms);
      //   }).then(() => {
      //     console.log(`Upload id: ${id}, error:  ${err.response.data.error.message}, retry number: ${iterator}, waited: ${ms}`);
      //     return pushFiles(auth, id, iterator + 1, ms*2);
      //   });
      // });

      // ----2. tanpa tunggu (langsung request ulang ketika mendapat respons 403)----  
      return clientUploadFile(auth).catch((err) => {
        // klo lewat rate limit, errornya 403
        if (err.code === 403) {
          console.log(`Upload id: ${id}, error:  ${err.response.data.error.message}, retry number: ${iterator}`);
          // note: perlu return agar promise clientUploadFile pertama (paling "atas" dari rekursif) resolve setelah semua rekursif di dalamnya selesai. 
          // penambahan return hanya diperlukan supaya bisa ngecek waktu ketika semua upload selesai. 
          return pushFiles(auth, id, iterator + 1, null);
        }
      });
    }

    let t1;
    let t0 = performance.now()

    for (let i = 1; i <= jumlahFile; i++) {
      let oAuth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectURI
      );      
      oAuth2Client.setCredentials({refresh_token: refreshTokenList[0]});
      uploads.push(pushFiles(oAuth2Client, i, 1, 1000));
      // pushFiles(oAuth2Client);
    }

    Promise.all(uploads).then(() => {
      t1 = performance.now()
      console.log("Semua upload sudah selesai! Waktu yang diperlukan: " + (t1 - t0) + " milliseconds.")
    });
    // ------------------------------------------------------------------------------------

  } 
// else if (type === "c") {
//     oAuth2Client.getToken(content, (err, token) => {
//       if (err) return console.error(err);

//       // catat token yang didapet dari sini
//       console.log(token);
//     });
//   }
// });
