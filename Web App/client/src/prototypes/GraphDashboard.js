// function DashboardGraph(props) {
//     const { scores, workType, names } = props;

//     let label = [];
//     for (let i = 0; i < scores.length; i++) {
//       label.push(i + 1);
//     }
//     const state = {
//       labels: label,
//       datasets: [
//         {
//           label: [1, 2],
//           backgroundColor: "#1976D2",
//           borderColor: "rgba(0,0,0,0)",
//           borderWidth: 2,
//           data: scores,
//           maxBarThickness: 60,
//         },
//       ],
//     };

//     return (
//       // A react-chart hyper-responsively and continuously fills the available
//       // space of its parent element automatically
//       <div>
//         <Bar
//           data={state}
//           options={{
//             legend: {
//               display: false,
//               position: "right",
//             },
//             scales: {
//               yAxes: [
//                 {
//                   id: "first-y-axis",
//                   type: "linear",
//                   ticks: {
//                     min: 0,
//                     max: 100,
//                   },
//                 },
//               ],
//             },
//             tooltips: {
//               callbacks: {
//                 label: function (tooltipItem, data) {
//                   var label = names[tooltipItem.index] || "";

//                   if (label) {
//                     label += ": ";
//                   }
//                   label += Math.round(tooltipItem.yLabel * 100) / 100;
//                   return label;
//                 },
//               },
//             },
//           }}
//           width="250px"
//           height="270px"
//         />
//       </div>
//     );
//   }

// This is used for graph?
// if (
//   this.state.allowedSubjectIndex === null &&
//   all_subjects.length !== 0 &&
//   Object.keys(kelas).length !== 0
// ) {
//   let allowedIndexes = [];
//   for (let i = 0; i < all_subjects.length; i++) {
//     if (kelas.subject_assigned.includes(all_subjects[i]._id)) {
//       allowedIndexes.push(i);
//     }
//   }
//   this.setState({ allowedSubjectIndex: allowedIndexes });
//   if (
//     this.state.taskGraphCurrentSubject === null &&
//     all_subjects.length !== 0
//   ) {
//     let randomNumber =
//       allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
//     this.setState({ taskGraphCurrentSubject: randomNumber });
//   }
//   if (
//     this.state.quizGraphCurrentSubject === null &&
//     all_subjects.length !== 0
//   ) {
//     let randomNumber =
//       allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
//     this.setState({ quizGraphCurrentSubject: randomNumber });
//   }
//   if (
//     this.state.examGraphCurrentSubject === null &&
//     all_subjects.length !== 0
//   ) {
//     let randomNumber =
//       allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];
//     this.setState({ examGraphCurrentSubject: randomNumber });
//   }
// }

// function graphTask(subjectIndex) {
//   if (all_subjects[subjectIndex]) {
//     let subject = all_subjects[subjectIndex]._id;
//     let subjectScores = [];
//     let subjectNames = [];
//     for (let i = 0; i < all_tasks.length; i++) {
//       if (all_tasks[i].grades && all_tasks[i].subject === subject) {
//         let keysArray = Object.keys(all_tasks[i].grades);
//         let valuesArray = Object.values(all_tasks[i].grades);
//         for (let j = 0; j < keysArray.length; j++) {
//           if (keysArray[j] === user._id) {
//             subjectScores.push(valuesArray[j]);
//             subjectNames.push(all_tasks[i].name);
//             break;
//           }
//         }
//       }
//     }
//     if (subjectScores.length !== 0) {
//       return (
//         <DashboardGraph
//           scores={subjectScores}
//           names={subjectNames}
//           workType="Tugas"
//         />
//       );
//     } else {
//       return (
//         <Grid item style={{ height: "270px", width: "250px" }}>
//           <div className={classes.greyBackground}>
//             <Typography
//               align="center"
//               color="textSecondary"
//               variant="subtitle1"
//             >
//               Belum ada Tugas yang telah dinilai untuk mata pelajaran
//               terkait
//             </Typography>
//           </div>
//         </Grid>
//       );
//     }
//   } else {
//     return (
//       <Grid item style={{ height: "270px", width: "250px" }}>
//         <div className={classes.greyBackground}>
//           <Typography
//             align="center"
//             color="textSecondary"
//             variant="subtitle1"
//           >
//             Belum ada Tugas yang telah dinilai untuk mata pelajaran terkait
//           </Typography>
//         </div>
//       </Grid>
//     );
//   }
// }

// function graphAssessment(subjectIndex, type) {
//   if (all_subjects[subjectIndex]) {
//     let subject = all_subjects[subjectIndex]._id;
//     let subjectScores = [];
//     let subjectNames = [];
//     if (type === "Kuis") {
//       for (let i = 0; i < all_assessments.length; i++) {
//         if (
//           all_assessments[i].grades &&
//           all_assessments[i].subject === subject &&
//           all_assessments[i].type === "Kuis"
//         ) {
//           let keysArray = Object.keys(all_assessments[i].grades);
//           let valuesArray = Object.values(all_assessments[i].grades);
//           for (let j = 0; j < keysArray.length; j++) {
//             if (keysArray[j] === user._id) {
//               subjectScores.push(valuesArray[j].total_grade);
//               subjectNames.push(all_assessments[i].name);
//               break;
//             }
//           }
//         }
//       }
//     } else if (type === "Ujian") {
//       for (let i = 0; i < all_assessments.length; i++) {
//         if (
//           all_assessments[i].grades &&
//           all_assessments[i].subject === subject &&
//           all_assessments[i].type === "Ujian"
//         ) {
//           let keysArray = Object.keys(all_assessments[i].grades);
//           let valuesArray = Object.values(all_assessments[i].grades);
//           for (let j = 0; j < keysArray.length; j++) {
//             if (keysArray[j] === user._id) {
//               subjectScores.push(valuesArray[j].total_grade);
//               subjectNames.push(all_assessments[i].name);
//               break;
//             }
//           }
//         }
//       }
//     }
//     if (subjectScores.length !== 0) {
//       return (
//         <DashboardGraph
//           scores={subjectScores}
//           names={subjectNames}
//           workType={type}
//         />
//       );
//     } else {
//       return (
//         <Grid item style={{ height: "270px", width: "250px" }}>
//           <div className={classes.greyBackground}>
//             <Typography
//               align="center"
//               color="textSecondary"
//               variant="subtitle1"
//             >
//               Belum ada {type} yang telah dinilai untuk mata pelajaran
//               terkait
//             </Typography>
//           </div>
//         </Grid>
//       );
//     }
//   } else {
//     return (
//       <Grid item style={{ height: "270px", width: "250px" }}>
//         <div className={classes.greyBackground}>
//           <Typography
//             align="center"
//             color="textSecondary"
//             variant="subtitle1"
//           >
//             Belum ada {type} yang telah dinilai untuk mata pelajaran terkait
//           </Typography>
//         </div>
//       </Grid>
//     );
//   }
// }
