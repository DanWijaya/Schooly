import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import {
	Fab,
	Grid,
	Hidden,
	Paper,
	Typography,
	Divider,
} from "@material-ui/core";
import LightTooltip from "../../misc/light-tooltip/LightTooltip";
import DeleteDialog from "../../misc/dialog/DeleteDialog";

import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import {
	getOneEvent,
	deleteEvent
} from "../../../actions/EventActions";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: "auto",
		maxWidth: "80%",
		[theme.breakpoints.down("md")]: {
			maxWidth: "100%",
		},
		padding: "10px"
	},
	paperBox: {
		padding: "20px",
	},
	dividerColor: {
		backgroundColor: theme.palette.primary.main,
	},
	editButton: {
		marginRight: "10px",
		backgroundColor: theme.palette.primary.main,
		color: "white",
		"&:focus, &:hover": {
			backgroundColor: "white",
			color: theme.palette.primary.main,
		},
	},
	deleteButton: {
		backgroundColor: theme.palette.error.dark,
		color: "white",
		"&:focus, &:hover": {
			backgroundColor: "white",
			color: theme.palette.error.dark,
		},
	}
}));

function ViewEvent(props) {
	document.title = "Schooly | Kalender";

	const classes = useStyles();

	const { getOneEvent } = props;
	const eventId = props.match.params.id;
	const { selectedEvent } = props.eventsCollection;

	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(null);

	const handleOpenDeleteDialog = () => {
		setOpenDeleteDialog(true);
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
	}

	React.useEffect(() => {
		getOneEvent(eventId);
	}, []);

	return (
		<div className={classes.root}>
			<DeleteDialog
				openDeleteDialog={openDeleteDialog}
				handleCloseDeleteDialog={handleCloseDeleteDialog}
				itemType="Kegiatan"
				itemName={selectedEvent.name}
				deleteItem={() => {
					deleteEvent(eventId);
				}}
				redirectLink="/kalender"
				isWarning={false}
			/>
			<Grid container direction="column" spacing={3}>
				<Grid item>
					<Paper className={classes.paperBox}>
						<Grid container spacing={2}>
							<Hidden smDown>
								<Grid item xs={12} style={{ paddingBottom: "0" }}>
									<Typography variant="h4">
										{selectedEvent.name}
									</Typography>
								</Grid>
								<Grid
									item
									md={12}
									spacing={8}
									style={{ paddingTop: "0" }}
								>
									{/* h6 ditambahkan agar margin teks ini dengan teks nama pengumuman 
									memiliki margin yang sama seperti pada halaman-halaman view objek lainnya */}
									<h6 style={{ marginBottom: "0" }}>
										<Typography
											align="right"
											variant="body2"
											color="textSecondary"
										>
											Mulai:{" "}
											{moment(selectedEvent.start_date)
												.locale("id")
												.format("DD MMM YYYY, HH:mm")}
										</Typography>
									</h6>
									<Typography
										align="right"
										variant="body2"
										color="textSecondary"
									>
										Selesai:{" "}
										{moment(selectedEvent.end_date)
											.locale("id")
											.format("DD MMM YYYY, HH:mm")}
									</Typography>
								</Grid>
							</Hidden>

							<Hidden mdUp>
								<Grid item xs={12}>
									<Typography variant="h4">
										{selectedEvent.name}
									</Typography>
								</Grid>

                <Grid item xs={12} md={7} spacing={8}>
									<Typography variant="body2" color="textSecondary">
										Mulai:{" "}
										{moment(selectedEvent.start_date)
											.locale("id")
											.format("DD MMM YYYY, HH:mm")}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Selesai:{" "}
										{moment(selectedEvent.end_date)
											.locale("id")
											.format("DD MMM YYYY, HH:mm")}
									</Typography>
								</Grid>
							</Hidden>

							<Grid item xs={12}>
								<Divider className={classes.dividerColor} />
							</Grid>

							<Grid item xs={12}>
								<Typography color="textSecondary" gutterBottom>
									Deskripsi Kegiatan:
                </Typography>
								<Typography>{selectedEvent.description}</Typography>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid
					item
					container
					justify="flex-end"
					alignItems="center"
					style={{ paddingTop: "4px" }}
				>
					<Grid item>
						<Link to={`/sunting-kegiatan/${eventId}`}>
							<LightTooltip title="Sunting" placement="bottom">
								<Fab className={classes.editButton}>
									<EditIcon />
								</Fab>
							</LightTooltip>
						</Link>
					</Grid>
					<Grid item>
						<LightTooltip title="Hapus" placement="bottom">
							<Fab
								className={classes.deleteButton}
								onClick={() => {
									handleOpenDeleteDialog();
								}}
							>
								<DeleteIcon />
							</Fab>
						</LightTooltip>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	eventsCollection: state.eventsCollection
});

export default connect(mapStateToProps, {
	getOneEvent
})(ViewEvent);
