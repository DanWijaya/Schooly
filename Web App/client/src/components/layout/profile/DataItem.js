import React from "react";
import {
  Avatar,
  Grid,
  Typography
} from "@material-ui/core";

function DataItem(props) {
  const { iconStyle, icon, type, value } = props;

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Avatar className={iconStyle}>
          {icon}
        </Avatar>
      </Grid>
      <Grid item xs container style={{ paddingTop: "15px" }}>
        <Grid item xs={12} md={5}>
          <Typography variant="overline" color="textSecondary" noWrap>
            <b>{type}</b>
          </Typography>
        </Grid>
        <Grid item xs={12} md={7}>
          {!value ? (
            <Typography color="textSecondary">Kosong</Typography>
          ) : (
            <Typography>
              {value}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DataItem;
