import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import {
  ArrowRightAlt as ArrowRightAltIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Web as WebIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  unitBackground: {
    width: "100%",
    height: "250px",
    borderRadius: "3px 3px 0px 0px",
    backgroundColor: theme.palette.primary.main,
  },
  unitIcon: {
    width: "75px",
    height: "75px",
  },
  unitButtons: {
    "&:focus, &:hover": {
      backgroundColor: "#F1F1F1",
    },
  },
}));

function UnitItem(props) {
  const classes = useStyles();
  const { data, handleOpenDeleteDialog } = props;

  return data.map((row, index) => {
    let viewpage = `/unit/${row._id}`;

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <Avatar variant="square" className={classes.unitBackground}>
            <WebIcon className={classes.unitIcon} />
          </Avatar>
          <CardContent style={{ marginBottom: "25px" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {row.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" noWrap>
              {row.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Grid container justify="space-between">
              <Grid item>
                <Link to={viewpage}>
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<ArrowRightAltIcon />}
                  >
                    Lihat
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Tooltip title="Sunting">
                  <Link to={`/sunting-unit/${row._id}`}>
                    <IconButton size="small" className={classes.unitButtons}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Link>
                </Tooltip>
                <Tooltip title="Hapus">
                  <IconButton
                    size="small"
                    className={classes.unitButtons}
                    onClick={(e) => {
                      handleOpenDeleteDialog(e, row._id, row.name);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    );
  });
}

UnitItem.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(UnitItem);
