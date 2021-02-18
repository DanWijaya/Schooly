const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
// const { performance } = require('perf_hooks'); // ---buat ngitung lama upload---

const path = "env.json";
let temp; 
fs.readFile(path, (err, content) => {
  if (err) return console.log('Error loading file:', err);
  temp = JSON.parse(content);
});
const {clientId, clientSecret, folderId, testFileName, testFileType, testFilePath, storedTokens } = temp;

// ditentuin di developer console
const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.file'
];

// didapat dari developer console
let redirectURI = "http://localhost:3000";
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectURI
);

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

function uploadFile(auth) {
  // sumber kode: https://developers.google.com/drive/api/v3/folder#create_a_file_in_a_folder
  const drive = google.drive({ version: 'v3', auth });

  var metadata = {
    name: testFileName, // *** (opsional, ga harus diganti) nama file ketika sudah diupload ***
    parents: [folderId] // *** ganti dengan folder id yang diperoleh dengan menjalankan fungsi createFolder() ***
  };

  var media = {
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// mendapatkan URL halaman login
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});
console.log('Untuk mendapatkan auth code, buka URL ini di browser:\n\n' + authUrl + '\n\n');

rl.question('Jika token sudah disalin di gdrive.js, masukkan "t". \r\nJika belum, masukkan "c <query param bagian \'code\' di url abis redirect>" untuk menampilkan token di terminal: ', (code) => {
  rl.close();
  
  let type = code.split(" ")[0];
  let content = code.split(" ")[1];

  if (type === "") {
    oAuth2Client.setCredentials(
      storedTokens
    );

    // ini untuk membuat folder. biar ga berantakan, file-file yang diupload nanti dimasukan ke folder yang dibuat ini
    // createFolder(oAuth2Client);


    // ------------------------ tes upload file dalam jumlah banyak ------------------------ 
    let jumlahFile = 100;
    // var t0 = performance.now()
    // var t1;

    let arr =  [];

    const pushFiles = () => {
      arr.push(uploadFile(oAuth2Client).then(() => {
      }).catch(() => {
         pushFiles()
      }))
    }

    for (let i = 1; i <= jumlahFile; i++) {
      pushFiles()  
    }

    // for (let i = 0; i <= jumlahmurid; i++) {
    //   arr.push(new Promise((resolve) => {
    //     let success = false;
    //     while (!success) {
    //       // lakuin upload dengan cara yg pake axios, bukan pake oauthclient  
    //       axios.post().then(() => {
    //         success = true
    //         resolve();
    //       }).catch(() => {
    //         //ga ngelakuin apa2, tapi catch ini tetep perlu ada biar Errornya ga kethrow ke parent}) ; 
    //       });
    //     }
    //   }))
    // }


    // Promise.all(work).then(() => {
      // console.log("Semua upload sudah selesai!")
      // t1 = performance.now()
      // console.log("Waktu yang diperlukan: " + (t1 - t0) + " milliseconds.")
    // }).catch((err) => {
      // klo lewat rate limit, nanti muncul error 403
      // console.log(err);
      // console.log(err.response.data.error);
    // });
    // ------------------------------------------------------------------------------------

  } else if (type === "c") {
    oAuth2Client.getToken(content, (err, token) => {
      if (err) return console.error(err);

      // catat token yang didapet dari sini
      console.log(token);
    });
  }
});