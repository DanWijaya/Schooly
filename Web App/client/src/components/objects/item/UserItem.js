import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "70px",
    borderRadius: "4px",
    color: "black",
    "&:focus, &:hover": {
      boxShadow:
        "0px 2px 3px 0px rgba(60,64,67,0.30), 0px 2px 8px 2px rgba(60,64,67,0.15)",
    },
  },
}));

function UserItem(props) {
  const classes = useStyles();
  const { data, avatar_map } = props;
  const { kelas } = props.classesCollection;

  const student_role = (id) => {
    switch (id) {
      case kelas.ketua_kelas:
        return "Ketua Kelas";

      case kelas.bendahara:
        return "Bendahara";

      case kelas.sekretaris:
        return "Sekretaris";

      default:
        return null;
    }
  };

  return data.map((row) => {
    let { name, email, _id } = row;

    return (
      <Link to={`/lihat-profil/${row._id}`}>
        <ListItem className={classes.root}>
          <ListItemAvatar>
            <Avatar src={avatar_map[_id]} />
          </ListItemAvatar>
          <ListItemText
            primary={<Typography noWrap>{name}</Typography>}
            secondary={
              <Typography variant="body2" color="textSecondary" noWrap>
                {email}
              </Typography>
            }
          />
          {student_role(row._id) ? (
            <ListItemText
              align="right"
              primary={<Chip label={student_role(row._id)} />}
            />
          ) : null}
        </ListItem>
      </Link>
    );
  });
}

UserItem.propTypes = {
  auth: PropTypes.object.isRequired,
  classesCollection: PropTypes.object.isRequired,
  subjectsCollection: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  classesCollection: state.classesCollection,
  subjectsCollection: state.subjectsCollection,
});

export default connect(mapStateToProps, {})(UserItem);
