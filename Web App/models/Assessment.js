const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create AssessmentSchema
const AssessmentSchema = new Schema(
  {
    unit: {
      type: ObjectId,
      default: null
    },
    name: {
      type: String,
      required: true,
    },
    class_assigned: [
      {
        type: ObjectId,
        required: true,
      },
    ],
    author_id: {
      type: ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: ObjectId,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    questions: [
      {
        name: { type: String, default: "" },
        options: { type: [String] },
        answer: { type: [String] },
        lampiran: [{ type: ObjectId, default: [] }],
        type: { type: String, required: true },
      },
    ],
    posted: { 
      type: Boolean, 
      // required: true,
      // default: false 
    },

    // jika atribut "posted" bernilai null, atribut ini berisi tanggal posting.
    // jika atribut "posted" berisi true atau false, atribut ini bernilai null.
    post_date: {
      type: Date,
      // required: true 
    },
    grades: {
      type: Map,
      // of: Object
    },
    /*
    isi grades adalah pasangan <id murid> - <value> dengan <value> adalah Object yang memiliki 2 pasangan key - value berikut:
    1) "total_grade" - <nilai dengan range 0-100>
    2) "longtext_grades" - < Object yg memiliki pasangan-pasangan key-value = <idx soal uraian>-<nilai dengan range 0-bobot soal> >

    contoh value grades:
    Map {
      5e9486667f32fa38946dc963: {
        total_grade: 95,
        longtext_grades: {
          0: 10,
          1: 10,
          2: 10
        }
      },
      5ed4ee415caa50389efaf014: {
        total_grade: 87,
        longtext_grades: {
          0: 0,
          1: 0,
          2: 10
        }
      }
    }

    - jika suatu soal uraian sudah dinilai, pasangan <idx soal uraian> - <nilai dengan range 0-bobot soal> akan ditambahkan ke dalam longtext_grades.
      jika belum dinilai, pasangan tidak ditambahkan.
    - ketika assessment pertama kali dibuat, atribut grades tidak ada. 
      atribut grades hanya ada jika:
      - assessment memiliki soal uraian dan guru sudah menilai minimal 1 jawaban uraian dari 1 murid
      (jika jawaban uraian seorang murid belum dinilai sama sekali, key id murid tersebut tidak akan ada di atribut grades); atau
      - assessment tidak memiliki soal uraian dan minimal ada 1 murid yang sudah mengumpulkan jawaban; 
    - jika murid mengumpulkan assessment yang tidak memiliki soal uraian, total_grades akan dihitung dengan longtext_grades diset menjadi null
    - (assessments.js, endpoint update grade uraian) 
      ketika guru selesai menentukan nilai jawaban uraian terakhir dan menyimpannya (longtext_grades sudah lengkap), total_grade akan dihitung.
      jika longtext_grades belum lengkap, total_grade bernilai null. 
    */

    submissions_timestamp: {
      type: Map
    },
    /* 
    - ketika assessment pertama kali dibuat, atribut ini tidak ada
    - isi atribut ini adalah pasangan <id murid> - <timestamp ketika submission diterima oleh server>
    */ 
    
    submissions: {
      type: Map,
    },
    /* 
    - ketika assessment pertama kali dibuat, atribut ini tidak ada
    - isi atribut ini adalah pasangan <id murid> - <array jawaban>. berikut adalah contoh submission untuk assessment dengan 
    tipe soal nomor 1 sampai 4: radio, checkbox, isian, esai.
    Map {
      5f44d55155cedc284824f5c1: [
        ["B"], ["A", "D"], [null, "jawaban isian", ""], ["jawaban esai"]
      ],
      5f5d8ffc6dd1f432b4f45ebb: [
        [], [], [], []
      ]
    }
    - jumlah elemen <array jawaban> sama dengan jumlah pertanyaan (questions.length) pada assessment
    - <array jawaban>[i] adalah jawaban murid untuk pertanyaan di index i (questions[i])
    - semua elemen <array jawaban> adalah array yang memiliki jumlah elemen >= 0
    - jumlah elemen di dalam elemen <array jawaban> soal bertipe isian tidak dipastikan sama dengan banyaknya kotak isian.
    misal ada satu soal isian yang ada 3 kotak isian (answer.length untuk soal ini = 3) dan 
    misal murid hanya menulis jawaban pada kotak isian ke-2. setelah disubmit, array jawaban 
    untuk soal ini = [null (sebenernya undefined, tapi diconvert jadi null oleh JSON.stringify saat membuat http request), "jawaban 2"].
    */

    type: {
      type: String,
      required: true,
    },
    // value atribut ini: "Kuis" atau Ujian"

    suspects: [ObjectId], // id murid
    question_weight: {
      radio: Number,
      checkbox: Number,
      shorttext: Number,
      longtext: Object,
    },
    /* 
    contoh value question_weight:
    {
      radio: 5,
      checkbox: 5,
      shorttext: 3,
      longtext: {
        0: 20,
        1: 20,
        2: 20
      }
    }
    - value "longtext" adalah Object yg memiliki pasangan-pasangan key-value: <index soal uraian>-<bobot>. 
    pasangan <index soal non uraian>-<bobot> tidak akan dimasukan di "longtext". 
    <bobot> bisa bernilai null. <bobot> bernilai null ketika assessment disimpan dengan kondisi nilai bobot kosong untuk soal uraian tersebut.
    - "<tipe soal>: null" jika dan hanya jika assessment tidak memiliki soal bertipe <tipe soal>. 
    contoh: assessment A cuma punya soal pg, maka isi question_weight: {
      radio: <nilai bobot pg>,
      checkbox: null,
      shorttext: null,
      longtext: null
    } 
    - bobot semua soal yang ada pada suatu assessment dipastikan diisi dan tidak bernilai <= 0
    */

  },
  { timestamps: true }
);

const Assessment = mongoose.model("assessments", AssessmentSchema);
module.exports = Assessment;
