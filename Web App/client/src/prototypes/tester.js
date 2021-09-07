import React from "react";
import ProfileDataItem from "./ProfileDataItem";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import CakeIcon from "@material-ui/icons/Cake";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "10px",
    paddingTop: "20px",
    maxWidth: "80%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },
  avatar: {
    width: "150px",
    height: "150px",
  },
  profileButtonContainer: {
    paddingTop: "25px",
    paddingBottom: "15px",
  },
  reportButton: {
    backgroundColor: theme.palette.action.selected,
    color: "black",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.divider,
      color: "black",
    },
  },
  dataCategoryHeader: {
    padding: "25px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  dataCategoryContent: {
    padding: "0px 25px 22.5px 25px",
  },
}));

function Tester(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Avatar className={classes.avatar} />
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            Niggas
          </Typography>
          <Typography variant="h6" color="textSecondary" align="center">
            Niggaman
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify="flex-end" className={classes.profileButtonContainer}>
        <Grid item>
          <a>
            <Button
              variant="contained"
              className={classes.reportButton}
              startIcon={<AssessmentOutlinedIcon />}
            >
              Lihat Rapor
            </Button>
          </a>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Paper elevation={2}>
            <div className={classes.dataCategoryHeader}>
              <Typography variant="h5" gutterBottom>
                Informasi Pengguna
              </Typography>
              <Typography gutterBottom>
                Berikut adalah informasi dari pengguna terkait.
              </Typography>
            </div>
            <div className={classes.dataCategoryContent}>
              <List>
                <ProfileDataItem
                  icon={<PersonIcon />}
                  type="Nama"
                  value="Test"
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<CakeIcon />}
                  type="Tanggal Lahir"
                  value="Test"
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<WcIcon />}
                  type="Jenis Kelamin"
                  value="Test"
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<EmailIcon />}
                  type="Email"
                  value="Test"
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<PhoneIcon />}
                  type="Nomor Telepon"
                  value="Test"
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<ContactPhoneIcon />}
                  type="Nomor Telepon Darurat"
                  value="Test"
                />
                <Divider variant="inset" />
                <ProfileDataItem
                  icon={<HomeIcon />}
                  type="Alamat"
                  value="Test"
                />
              </List>
            </div>
          </Paper>
        </Grid>
          <Grid item>
            <Paper elevation={2}>
              <div className={classes.dataCategoryHeader}>
                <Typography variant="h5" gutterBottom>
                  Karir
                </Typography>
                <Typography gutterBottom>
                  Berikut adalah pilihan karir yang diinginkan dari
                  murid terkait.
                </Typography>
              </div>
              <div className={classes.dataCategoryContent}>
                <List>
                  <ProfileDataItem
                    icon={<SportsEsportsIcon />}
                    type="Hobi dan Minat"
                    value="Test"
                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    icon={<ColorLensIcon />}
                    type="Keterampilan Non-Akademik"
                    value="Test"

                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    icon={<WorkIcon />}
                    type="Cita-Cita"
                    value="Test"

                  />
                  <Divider variant="inset" />
                  <ProfileDataItem
                    icon={<AccountBalanceIcon />}
                    type="Perguruan Tinggi Impian"
                    value="Test"

                  />
                </List>
              </div>
            </Paper>
          </Grid>
      </Grid>
    </div>
  );
}

export default Tester;
