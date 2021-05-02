const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create AssessmentSchema
const AssessmentSchema = new Schema(
  {
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
        lampiran: [{ type: ObjectId, default: []}],
        type: { type: String, required: true },
      },
    ],
    posted: { type: Boolean, required: true, default: false },
    grades: {
      type: Map,
      // of: Object
    },
    // isi grades adalah pasangan <id murid> - <value>.
    // <value> adalah Object yang memiliki 2 pasangan key-value:
    // 1) "total_grade" - <nilai dengan range 0-100>
    // 2) "longtext_grades" - < Object yg memiliki pasangan-pasangan key-value = <idx soal uraian>-<nilai dengan range 0-bobot soal> >

    // contoh value grades:
    // Map {
    //   5e9486667f32fa38946dc963: {
    //     total_grade: 95,
    //     longtext_grades: {
    //       0: 10,
    //       1: 10,
    //       2: 10,
    //     }
    //   },
    //   5ed4ee415caa50389efaf014: {
    //     total_grade: 87,
    //     longtext_grades: {
    //       0: 0,
    //       1: 0,
    //       2: 10,
    //     }
    //   },
    // }

    /* NOTE
    - jika suatu soal uraian sudah dinilai, pasangan <idx soal uraian>-<nilai dengan range 0-bobot soal> > ditambahkan ke dalam longtext_grades.
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

    submissions: {
      type: Map,
    },
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
    // value longtext adalah Object yg memiliki pasangan-pasangan key-value = <idx soal uraian>-<bobot>
    // contoh value question_weight:
    // {
    //   radio: 5,
    //   checkbox: 5,
    //   shorttext: 3,
    //   longtext: {
    //     0: 20,
    //     1: 20,
    //     2: 20
    //   }
    // }

    // NOTE
    // (di CreateAssessment.js, di fungsi onSubmit) 
    // - assessment tidak punya suatu tipe soal jika dan hanya jika value untuk key tipe soal tersebut = null
    // - bobot semua soal yang ada pada suatu assessment dipastikan diisi dan tidak bernilai <= 0
  },
  { timestamps: true }
);

const Assessment = mongoose.model("assessments", AssessmentSchema);
module.exports = Assessment;