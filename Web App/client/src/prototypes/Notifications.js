import React, {Component} from 'react';
import {List, ListItem, Typography, Grid, Paper, makeStyles, Icon, Avatar, ListItemAvatar} from '@material-ui/core'
import SchoolIcon from '@material-ui/icons/School';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import NewReleasesRoundedIcon from '@material-ui/icons/NewReleasesRounded';
import { grey } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '1100px',
        margin: 'auto',
        marginTop: '30px'
    },
    time: {
        color: grey,
        marginRight: 0,
    }

}));

function NotificationItem(props) {
    const classes = useStyles();

    return (
        <ListItem style={{display: 'flex', justifyContent: 'space-between'}}>
            <ListItemAvatar>
                <Avatar>
                    {props.icon}
                </Avatar>
            </ListItemAvatar>
            <Typography>
                {props.statement}
            </Typography>
            <Typography variant="subtitle" style={{ color: 'grey', marginRight: '0px'}}>
                {props.time}
            </Typography>
        </ListItem>
    )
}

function Notifications(props) {

    const classes = useStyles();

    return(
        <div className={classes.root}>
            <Typography variant="h5">
                Your Notifications
            </Typography>
            <br/>
            <Grid item >
                <Paper className="paperBox">
                    <List>
                        <NotificationItem time={"20m ago"} statement={"Ingat! Tugas mu yang harus dikelarkan besok belum kamu kumpul."} icon={<AssignmentRoundedIcon/>}/>
    <NotificationItem time={"1h ago"}  statement={"Botol air mu ketinggalan, ambil di meja security di lobby."} icon={<NewReleasesRoundedIcon/>}/>
                        <NotificationItem time={"2h ago"}  statement={"Ingat! Tugas mu yang harus dikelarkan besok belum kamu kumpul."} number={3}/>
                        <NotificationItem time={"3h ago"}  statement={"Ingat! Tugas mu yang harus dikelarkan besok belum kamu kumpul."} number={4}/>
                        <NotificationItem time={"10h ago"}  statement={"Ingat! Tugas mu yang harus dikelarkan besok belum kamu kumpul."} number={5}/>
                    </List>
                </Paper>
            </Grid>
        </div>
    )
}

export default Notifications;