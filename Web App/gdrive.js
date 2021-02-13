const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
// const { performance } = require('perf_hooks'); // ---buat ngitung lama upload---

// ditentuin di developer console
const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.file'
];

// didapat dari developer console
let client_id = "453201823549-t53et7n888aaco942suqf304ihlp9mot.apps.googleusercontent.com";
let client_secret = "qo7Yp7kf_WnVs04wrjqPgo2R";
let redirect_uri = "http://localhost:3000";
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
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

  let folderId = "164XemTSx54-K99M8Y-fP9dyk8P85GKtB"; // *** ganti dengan folder id yang diperoleh dengan menjalankan fungsi createFolder() ***

  var metadata = {
    'name': 'test.txt', // *** (opsional, ga harus diganti) nama file ketika sudah diupload ***
    parents: [folderId]
  };

  var media = {
    mimeType: 'text/plain', // *** ganti kalau file yang diupload itu bukan 'txt'. https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types ***
    body: fs.createReadStream('C:/Schooly/test.txt') // *** ganti dengan file yang akan diupload ***
  };

  // drive.files.create() adalah promise.
  // promise ini direturn agar waktu yang diperlukan untuk melakukan semua upload bisa dihitung 
  return drive.files.create({
    resource: metadata,
    media: media,
    fields: 'id'
  });
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

  if (type === "t") {
    oAuth2Client.setCredentials(
      // *** buat sekarang, salin dulu aja token yang ditampilin di terminal abis masukin "c ..." di sini ***
      // contoh:
      // {
      //   access_token: '',
      //   refresh_token: '',
      //   scope: '',
      //   token_type: '',
      //   expiry_date:
      // }
      {
        access_token: 'ya29.A0AfH6SMBhUe5uaBqbQBsSyXm8UM28jhUt_Mbh9CDJySOXIe9KwFmBC15j-hh0Lx1dbUSmGbXMjVxitZOeUzWt-CAwccIdBijAky8WwKq61wE4dsWPYxyjjHoBpzJ-bN1eLToL6InXNbC9rJ49SHkbH15jwq-8',
        refresh_token: '1//0gz0cF7MkQuE1CgYIARAAGBASNwF-L9Irq9JWULHUHKz7JkT8ZtibbNEeurhmaBEU2JfDvmG8n3oRMjGkcgvHmNsDD3CFU0JZ7nA',
        scope: 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file',
        token_type: 'Bearer',
        expiry_date: 1613222297202
      }
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

    // for (let i = 1; i <= jumlahFile; i++) {
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
    // Promise.all(arr).then(() => {
    //   console.log("Semua upload sudah selesai!")
    //   // t1 = performance.now()
    //   // console.log("Waktu yang diperlukan: " + (t1 - t0) + " milliseconds.")
    // }).catch((err) => {

    //   // klo lewat rate limit, nanti muncul error 403
    //   console.log(err.response.data.error);
    // });
    // ------------------------------------------------------------------------------------

  } else if (type === "c") {
    oAuth2Client.getToken(content, (err, token) => {
      if (err) return console.error('Error retrieving access token');

      // catat token yang didapet dari sini
      console.log(token);
      // contoh token
      // {
      //   access_token: <string> ,
      //   refresh_token: <string>,
      //   scope: <string>,
      //   token_type: 'Bearer',
      //   expiry_date: <epoch>
      // }
    });
  }
});