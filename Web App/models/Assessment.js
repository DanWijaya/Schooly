const { ObjectId } = require("mongodb"); // API from mongoose MongoDB
const mongoose = require("mongoose"); // Require Mongoose
const Schema = mongoose.Schema; // Define a Schema

// Create Assessment Schema
const AssessmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // The value of this attribute is Quiz or Exam.
    type: {
      type: String,
      required: true,
    },
    unit: {
      type: ObjectId,
      default: null,
    },
    class_assigned: [
      {
        type: ObjectId,
        required: true,
      },
    ],
    subject: {
      type: ObjectId,
      required: true,
    },
    author_id: {
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
    posted: {
      type: Boolean,
      // required: true,
      // default: false
    },
    // If "posted" attributes has a value of null, this attribute contains date posted.
    // If "posted" attribute has a value of true atau false, this attribute will be filled with null.
    post_date: {
      type: Date,
      // required: true
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
    question_weight: {
      radio: Number,
      checkbox: Number,
      shorttext: Number,
      longtext: Object,
    },
    /*
    Example of question_weight:
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

    The value "longtext" is an Object that has key-value pair of <long text question index> - <weight>.
    This pair is not inserted into "longtext".
    <weight> can contain a value of null. <weight> contains a value o null when assessment is saved with empty weight for that long text question.

    <question type> has a value of null, only if the assessment doesn't has a question with the type of <question type>.
    For example: Assessment A only has multiple choice, then it is filled with
    question_weight: {
      radio: <nilai bobot pg>,
      checkbox: null,
      shorttext: null,
      longtext: null
    }

    Weight of all question in an assessment are ensured to be filled and doesn't has a value less or equal to 0.
    */

    submissions: {
      type: Map,
    },
    /*
    When an assessment is made for the first time, it won't have this attribute.
    This attribute contains the pair of <student's id> - <array of answer>.

    These are the example of submission for assessment with multiple choice, checkbox, short text, and long text, respectively from 1 to 4.
    Map {
      5f44d55155cedc284824f5c1: [
        ["B"], ["A", "D"], [null, "jawaban isian", ""], ["jawaban esai"]
      ],
      5f5d8ffc6dd1f432b4f45ebb: [
        [], [], [], []
      ]
    }

    Number of element <answer array> is equal to number of questions (questions.length) in an assessment.
    <answer array>[i] is the student answer for the question with index of i (questions[i]).
    All <answer array> element are arrays that have number of element greater or equal to 0.

    Number of element in <answer array> element of short text question is not ensured equal to the number of the blanks.
    For example:
    There is one short text question that has 3 blanks (answer.length untuk soal ini = 3) and
    if a student only answer the second blank. When it is submitted, the answer array for this question will be
    [null, "answer"].
    (null is actually undefined, but is converted to null by JSON.stringify when making http request)
    */


    submissions_timestamp: {
      type: Map,
    },
    /*
    When an assessment is made for the first time, it won't have this attribute.
    This attribute contains the pair of <student's id> - <timestamp of receival from server>.
    */

    grades: {
      type: Map,
      // of: Object
    },
    /*
    Grades contains the pair of <student's id> - <value>,
    with <value> is an Object that has another two pair of key - value:
    1) "total_grade" - <score with range of 0 - 100>
    2) "longtext_grades" - <Object that has pairs of key-value = <long text question idx> - <score with the range of 0 - question weight>>

    Example of grade value:
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

    If a long text question is already graded, the <long text question idx> - <score with the range of 0 - question weight> pair will be added to longtext_grades.
    If it is not graded, then it won't be added.

    When an assessment is made for the first time, it won't have this attribute.
    It will only has this attribute when:
    - The assessment has long text question dan teacher has scored at least 1 long text question from 1 student.
      (If a student's long text question answer is not yet scored, that sudent's id key id will not be in attributes grades) or
    - Assessment doesn't has long text question dan there is at least 1 student that has submitted their answer.

    - If student  submit an assessment that has no long text question, total_grades will be counted with longtext_grades is set to null.
    - (assessments.js, endpoint update of long text question grade)
      When teacher finish determine the last long text question answer grade and save it (longtext_grades is complete), total_grade will be counted.
      If longtext_grades is not complete, total_grade equals to null.
    */
    suspects: [ObjectId], // student's id
  },
  { timestamps: true }
);

const Assessment = mongoose.model("assessments", AssessmentSchema);
module.exports = Assessment;
