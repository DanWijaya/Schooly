import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '800px',
        margin: 'auto',
        marginTop: '30px',
    },
    avatar: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        margin: 'auto'
    },
    paperBox: {
        width: "750px",
        paddingTop: "20px",
        paddingBottom: "10px",
        paddingLeft: "17.5px",
        paddingRight: "17.5px",
      }, 
      paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
})
)

function ClassPage(props) {
    // const { user } = props.auth;
    const classes = useStyles()

    return (
        <div className={classes.root}>
        <Grid container direction="column" alignItems="center" spacing={5}>
          <Grid item container direction="column" alignItems="center">
              <Typography variant="subtitle2">
                  Kelas XA
              </Typography>
          </Grid>
          <Grid item container spacing={4}>
            <Grid item>
              <Paper className={classes.paperBox}>
                  <Typography variant="subtitle2" gutterBottom>
                    <h4>Informasi Pribadi</h4>
                  </Typography>
                  <List>
                    <ProfileData
                      profile_data_icon={<PersonIcon />}
                      profile_data_category="Nama"
                      profile_data_info={user.name}
                    />
                    <ProfileData
                      profile_data_icon={<CakeIcon />}
                      profile_data_category="Tanggal Lahir"
                      profile_data_info="fucker"
                    />
                    <ProfileData
                      profile_data_icon={<WcIcon />}
                      profile_data_category="Jenis Kelamin"
                      profile_data_info="Nigga"
                    />
                    <ProfileData
                      profile_data_icon={<LockIcon />}
                      profile_data_category="Kata Sandi"
                      profile_data_info="Nigga"
                    />
                  </List>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paperBox}>
                  <Typography variant="subtitle2" gutterBottom>
                    <h4>Kontak</h4>
                  </Typography>
                  <List>
                    <ProfileData
                      profile_data_icon={<EmailIcon />}
                      profile_data_category="Email"
                      profile_data_info={user.email}
                    />
                    <ProfileData
                      profile_data_icon={<PhoneIcon />}
                      profile_data_category="Nomor Telp."
                      profile_data_info={user.phone}
                    />
                    <ProfileData
                      profile_data_icon={<SupervisorAccountIcon />}
                      profile_data_category="Nomor Telp. Darurat"
                      profile_data_info={user.emergency_phone}
                    />
                    <ProfileData
                      profile_data_icon={<HomeIcon />}
                      profile_data_category="Alamat"
                      profile_data_info={user.address}
                    />
                  </List>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paperBox}>
                  <Typography variant="subtitle2" gutterBottom>
                    <h4>Informasi lainnya</h4>
                  </Typography>
                  <List>
                    <ProfileData
                      profile_data_icon={<GamesIcon />}
                      profile_data_category="Hobi dan minat"
                      profile_data_info="Killin, fuckin, and rapin"
                    />
                    <ProfileData
                      profile_data_icon={<BookIcon />}
                      profile_data_category="Skill Extrakurikuler"
                      profile_data_info="fuckin"
                    />
                    <ProfileData
                      profile_data_icon={<WorkIcon />}
                      profile_data_category="Cita Cita"
                      profile_data_info="fucker"
                    />
                    <ProfileData
                      profile_data_icon={<SchoolIcon />}
                      profile_data_category="Perguruan Tinggi yang saya minati"
                      profile_data_info="fucker university"
                    />
                  </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
    
}

ClassPage.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(
    mapStateToProps, 
)