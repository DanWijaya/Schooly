import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function Timer() {
  const classes = useStyles();

  let startTime = new Date("Sep 5, 2020 21:00:00");
  let finishTime = new Date("Sep 5, 2020 23:00:00");

  let workTime = Math.floor((finishTime - startTime) / 1000);
  let res = Math.floor((finishTime - new Date()) / 1000);
  // var hours = Math.floor(res / 3600) % 24;
  // var minutes = Math.floor(res / 60) % 60;
  // var seconds = res % 60;

  const [time, setTime] = React.useState(res);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <Typography
        variant="h5"
        component="div"
        color="textSecondary"
        style={{ marginBottom: "20px" }}
      >
        Waktu Selesai: {finishTime.toLocaleTimeString("id-ID")}
      </Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="static"
          value={(res / workTime) * 100}
          size={200}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" component="div" color="textSecondary">
            {`${Math.floor(time / 3600) % 24} ${Math.floor(time / 60) % 60} : ${
              time % 60
            }`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default Timer;
