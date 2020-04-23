import React, {Component} from 'react';
import {List, ListItem, Typography, Grid, Paper, makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '900px',
        margin: 'auto',
        marginTop: '30px'
    }

}));

function NotificationItem(props) {
    return (
        <ListItem>
            <Typography>
                Notification Item {props.number}
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
            <Grid item>
                <Paper className="paperBox">
                    <List>
                        <NotificationItem number={1}/>
                        <NotificationItem number={2}/>
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