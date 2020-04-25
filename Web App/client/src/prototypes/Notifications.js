import React, {Component} from 'react';
import {List, ListItem, Typography, Grid, Paper, makeStyles, Icon, Avatar, ListItemAvatar} from '@material-ui/core'
import SchoolIcon from '@material-ui/icons/School';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import NewReleasesRoundedIcon from '@material-ui/icons/NewReleasesRounded';
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '1500px',
        margin: 'auto',
        marginTop: '30px'
    }

}));

function NotificationItem(props) {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    {props.icon}
                </Avatar>
            </ListItemAvatar>
            <Typography>
                {props.statement}
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
                        <NotificationItem statement={"Ingat! Tugas mu yang harus dikelarkan besok belum kamu kumpul."} icon={<AssignmentRoundedIcon/>}/>
    <NotificationItem statement={"Botol air mu ketinggalan, ambil di meja security di lobby."} icon={<NewReleasesRoundedIcon/>}/>
                        <NotificationItem number={3}/>
                        <NotificationItem number={4}/>
                        <NotificationItem number={5}/>
                    </List>
                </Paper>
            </Grid>
        </div>
    )
}

export default Notifications;