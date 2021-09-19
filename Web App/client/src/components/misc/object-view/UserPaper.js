// import React from 'react'
// import UserMenu from "../menu-user/UserMenu";

// function UserPaper(props) {
//     const { data , } = props;
//     return (
//            <ListItem key={row} role={undefined} button>
//         <ExpansionPanelSummary className={classes.profilePanelSummary} style={{ cursor: "pointer" }}>
//             <Grid
//             container
//             spacing={1}
//             justify="space-between"
//             alignItems="center"
//             >
//             <Grid item justify="flex-start">
//                 <Grid item>
//                 <LightTooltip title="Aktifkan">
//                     <FormGroup>
//                     <FormControlLabel
//                         control={
//                         <Checkbox
//                             onClick={(e) => {
//                             e.stopPropagation();
//                             }}
//                             onChange={(e) => {
//                             handleChangeListStudent(e, index, row);
//                             autoReloader();
//                             }}
//                             color="primary"
//                             checked={Boolean(booleanCheckboxStudent[index])}
//                         />
//                         }
//                     />
//                     </FormGroup>
//                 </LightTooltip>
//                 </Grid>
//             </Grid>

//             <Hidden xsDown>
//                 <Grid item>
//                 {!row.avatar ? (
//                     <ListItemAvatar >
//                     <Avatar />
//                     </ListItemAvatar>
//                 ) : (
//                     <ListItemAvatar>
//                     <Avatar src={`/api/upload/avatar/${row.avatar}`} />
//                     </ListItemAvatar>
//                 )}
//                 </Grid>
//             </Hidden>


//             <Grid item>
//                 <Hidden smUp implementation="css">
//                 <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: "11rem" }}>
//                     <Typography variant="subtitle1" id={labelId} noWrap>
//                     {row.name}
//                     </Typography>


//                     <Typography variant="caption" color="textSecondary" noWrap>
//                     {row.email}
//                     </Typography>
//                 </div>
//                 </Hidden>
//                 <Hidden xsDown implementation="css">
//                 <Typography variant="h6" id={labelId}>
//                     {row.name}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                     {row.email}
//                 </Typography>
//                 </Hidden>
//             </Grid>


//             <Grid item xs container spacing={1} justify="flex-end">

//                 <ListItemSecondaryAction
//                 button
//                 onClick={(e) => {
//                     e.stopPropagation()
//                 }}
//                 onChange={(e) => {
//                     e.stopPropagation()
//                 }}
//                 >
//                 {/* <IconButton type="button" onClick={(e) => e.preventDefault()}>
//                     More
//                     </IconButton> */}
//                 <UserMenu
//                     options={["Nonaktifkan", "Hapus"]}
//                     role={null}
//                     row={row}
//                     handleOpenDeleteDialog={handleOpenDeleteDialog}
//                     handleOpenDisableApproveDialog={handleOpenDisableDialog}
//                 />

//                 </ListItemSecondaryAction>
//             </Grid>

//             </Grid>
//         </ExpansionPanelSummary>
//         <Divider />
//         </ListItem> 
//     )
// }

// export default UserPaper
