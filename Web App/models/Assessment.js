const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = require("mongodb");

// Create AssessmentSchema
const AssessmentSchema = new Schema({ 
    name: {
        type: String, 
        required: true
    },
    class_assigned: [{
        type: ObjectId,
        required: true
    }],
    author_id: {
        type: ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
      type: ObjectId,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    questions: [{
        name: {type: String, default: ""},
        options: {type: [String]},
        answer: {type: [String]},
        lampiran: [{ type: ObjectId , default: [], _id: false}],
        type: {type: String, required: true}
    }],
    posted: { type: Boolean, required: true, default: false},
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
      - guru sudah menilai minimal 1 jawaban uraian dari 1 murid; atau 
      - ada minimal 1 murid yang sudah mengumpulkan jawaban assessment yang tidak memiliki soal uraian; 
    - jika murid mengumpulkan assessment yang tidak memiliki soal uraian, total_grades akan dihitung dengan longtext_grades diset menjadi null
    - (assessments.js, endpoint update grade uraian) 
      ketika guru selesai menentukan nilai jawaban uraian terakhir dan menyimpannya (longtext_grades sudah lengkap), total_grade akan dihitung.
      jika longtext_grades belum lengkap, total_grade bernilai null. jika soal uraian belum dinilai sama sekali, key id murid tidak akan ada 
      di atribut grades.
    */

    submissions:{
      type: Map,
    },
    type: {
      type: String,
      required: true
    },
    suspects: [ObjectId],
    question_weight: {
      radio: Number,
      checkbox: Number,
      shorttext: Number,
      longtext: Object
    }
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
    // (di CreateAssessment.js, di fungsi onSubmit) jika assessment tidak punya suatu tipe soal, value untuk key tipe soal tersebut = null
    // (di CreateAssessment.js, di fungsi onSubmit) bobot semua soal yang ada pada suatu assessment dipastikan diisi dan tidak bernilai 0 

})

module.exports = Assessment = mongoose.model("assessments", AssessmentSchema);