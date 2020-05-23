import React from "react";
import PropTypes from "prop-types";
import OutlinedTextField from "../../misc/text-field/OutlinedTextField";
import { Avatar, Button, Box, Dialog, Grid, IconButton, List, ListItem, ListItemAvatar,
   Paper, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BookIcon from "@material-ui/icons/Book";
import CakeIcon from "@material-ui/icons/Cake";
import CloseIcon from "@material-ui/icons/Close";
import ContactsIcon from "@material-ui/icons/Contacts";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import EditIcon from "@material-ui/icons/Edit";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import EmailIcon from "@material-ui/icons/Email";
import GamesIcon from "@material-ui/icons/Games";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import SchoolIcon from "@material-ui/icons/School";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme) => ({
  buttonEditProfile: {
    backgroundColor: "#2196f3",
    color: "white",
    marginBottom: "10px",
    width: "200px",
    "&:focus": {
      backgroundColor: "#2196f3",
    },
    "&:hover": {
      backgroundColor: "#2196f3",
    },
  },
  dialogRoot: {
    padding: "15px",
  },
  iconButtonClose: {
    backgroundColor: "transparent",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  tabList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width:"500px",
    height: "300px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabIndex(index) {
  return {
    id: `tab-${index}`,
  };
}

function ProfileDataItemEdit(props) {
  return(
    <ListItem>
        <ListItemAvatar>
          <Avatar style={{backgroundColor: "#2196f3"}}>
            {props.profile_data_icon}
          </Avatar>
        </ListItemAvatar>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="button">
              {props.profile_data_category}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <OutlinedTextField />
          </Grid>
        </Grid>
    </ListItem>
  )
}

function ProfileDataEditorDialog() {
  const classes = useStyles();

  //Dialog
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //Tabs
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<EditIcon />}
        className={classes.buttonEditProfile}
      >
        Sunting Profil
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Grid container direction="column" alignItems="center" className={classes.dialogRoot}>
          <Grid item container justify="flex-end" alignItems="flex-start" style={{marginBottom: "10px"}}>
            <IconButton
              size="small"
              disableRipple
              onClick={handleClose}
              className={classes.iconButtonClose}
            >
                <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item style={{marginBottom: "30px"}}>
            <Typography variant="h5" gutterBottom>
              <b>Sunting Profil</b>
            </Typography>
          </Grid>
          <form>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<ContactsIcon />} label="Informasi Pribadi" {...TabIndex(0)} />
              <Tab icon={<ContactMailIcon />} label="Kontak" {...TabIndex(0)} />
              <Tab icon={<EmojiPeopleIcon />} label="Karier" {...TabIndex(0)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <List className={classes.tabList}>
                <ProfileDataItemEdit
                  profile_data_icon={<PersonIcon />}
                  profile_data_category="Nama"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<CakeIcon />}
                  profile_data_category="Tanggal Lahir"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<WcIcon />}
                  profile_data_category="Jenis Kelamin"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<SchoolIcon />}
                  profile_data_category="Sekolah"
                />
              </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <List className={classes.tabList}>
                <ProfileDataItemEdit
                  profile_data_icon={<EmailIcon />}
                  profile_data_category="Email"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<PhoneIcon />}
                  profile_data_category="Nomor Telepon"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<SupervisorAccountIcon />}
                  profile_data_category="Nomor Telepon Darurat"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<HomeIcon />}
                  profile_data_category="Alamat"
                />
              </List>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <List className={classes.tabList}>
                <ProfileDataItemEdit
                  profile_data_icon={<GamesIcon />}
                  profile_data_category="Hobi dan Minat"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<BookIcon />}
                  profile_data_category="Kemampuan Ekstrakurikuler"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<WorkIcon />}
                  profile_data_category="Cita-Cita"
                />
                <ProfileDataItemEdit
                  profile_data_icon={<AccountBalanceIcon />}
                  profile_data_category="Perguruan Tinggi Impian"
                />
              </List>
            </TabPanel>
            <Grid container justify="flex-end" alignItems="center" style={{marginTop: "15px"}}>
              <Button
                type="submit"
                style={{backgroundColor: "#2196f3", color: "white"}}
                onClick={handleClose}
              >
                Simpan
              </Button>
            </Grid>
          </form>
        </Grid>
      </Dialog>
    </div>
  )
}

export default ProfileDataEditorDialog;
