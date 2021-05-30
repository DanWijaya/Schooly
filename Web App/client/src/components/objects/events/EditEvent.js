import React, { Component } from "react";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import lokal from "date-fns/locale/id";
import {
	Button,
	Divider,
	Grid,
	Paper,
	Snackbar,
	TextField,
	Typography
} from "@material-ui/core";
import {
	MuiPickersUtilsProvider,
	KeyboardDateTimePicker
} from "@material-ui/pickers";
import MuiAlert from "@material-ui/lab/Alert";

import DeleteDialog from "../../misc/dialog/DeleteDialog";
import UploadDialog from "../../misc/dialog/UploadDialog";

import { withStyles } from "@material-ui/core/styles";

import { updateEvent, getOneEvent } from "../../../actions/EventActions";

const styles = (theme) => ({
	root: {
		margin: "auto",
		maxWidth: "80%",
		[theme.breakpoints.down("md")]: {
			maxWidth: "100%",
		},
		padding: "10px",
	},
	content: {
		padding: "20px",
	},
	divider: {
		[theme.breakpoints.down("md")]: {
			width: "100%",
			height: "1px",
		},
	},
	cancelButton: {
		backgroundColor: theme.palette.error.main,
		color: "white",
		"&:focus, &:hover": {
			backgroundColor: theme.palette.error.main,
			color: "white"
		},
		marginRight: "7.5px",
	},
	createButton: {
		backgroundColor: theme.palette.success.main,
		color: "white",
		"&:focus, &:hover": {
			backgroundColor: theme.palette.success.main,
			color: "white"
		},
	},
});


class EditEvent extends Component {
	constructor() {
		super();
		this.state = {
			openUploadDialog: false,
			success: false,
			errors: {},
			openDeleteDialog: false,
			name: "",
			description: "",
			start_date: new Date(),
			end_date: new Date(),
			isEventLoaded: false,
			snackbarContent: "",
			severity: "info",
			openSnackbar: false
		}
	}

	componentDidMount() {
		this.props.getOneEvent(this.props.match.params.id);
	}

	componentDidUpdate() {
		if (!this.state.isEventLoaded) {
			const { name, description, start_date, end_date } = this.props.eventsCollection.selectedEvent;
			this.setState({
				name,
				description,
				start_date: new Date(start_date),
				end_date: new Date(end_date),
				isEventLoaded: true
			});
		}
	}

	handleOpenSnackbar = (severity, content) => {
		this.setState({
			snackbarContent: content,
			severity,
			openSnackbar: true
		});
	};

	handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		this.setState({
			openSnackbar: false
		});
	};

	handleOpenUploadDialog = () => {
		this.setState({ openUploadDialog: true });
	};

	handleOpenDeleteDialog = () => {
		this.setState({ openDeleteDialog: true });
	};

	handleCloseDeleteDialog = () => {
		this.setState({ openDeleteDialog: false });
	};

	onSubmit = (e) => {
		e.preventDefault();
		const {
			name,
			description,
			start_date,
			end_date
		} = this.state;

		const eventData = {
			name,
			description,
			start_date,
			end_date
		};

		this.setState({ openUploadDialog: true });
		updateEvent(eventData, this.props.match.params.id).then(() => {
			this.setState({ success: true });
		}).catch((err) => {
			if (err.response.status === 400) {
				this.setState({ errors: err.response.data, openUploadDialog: false })
			} else {
				this.setState({ openUploadDialog: false });
			}
			this.handleOpenSnackbar("error", "Kegiatan gagal disunting");
		});
	};

	onChange = (e, otherfield) => {
		if (otherfield === "end_date" || otherfield === "start_date") {
			this.setState({ [otherfield]: e });
		} else {
			this.setState({ [otherfield]: e.target.value });
		}
	};

	render() {
		document.title = "Schooly | Sunting Kegiatan";

		const {
			openUploadDialog,
			openDeleteDialog,
			name,
			description,
			start_date,
			end_date,
			success,
			errors,
			snackbarContent,
			severity,
			openSnackbar
		} = this.state;

		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<UploadDialog
					openUploadDialog={openUploadDialog}
					success={success}
					messageUploading="Kegiatan sedang disunting"
					messageSuccess="Kegiatan telah disunting"
					redirectLink={`/kegiatan/${this.props.match.params.id}`}
				/>
				<DeleteDialog
					openDeleteDialog={openDeleteDialog}
					handleCloseDeleteDialog={this.handleCloseDeleteDialog}
					itemType="Kegiatan"
					itemName={name}
					redirectLink="/kalender"
					isWarning={false}
				/>
				<Paper>
					<div className={classes.content}>
						<Typography variant="h5" gutterBottom>
							<b>Sunting Kegiatan</b>
						</Typography>
					</div>
					<Divider />
					<form noValidate onSubmit={(e) => this.onSubmit(e)}>
						<Grid container>
							<Grid item xs={12} md className={classes.content}>
								<Grid container direction="column" spacing={4}>
									<Grid item>
										<Typography component="label" for="name" color="primary">
											Judul
										</Typography>
										<TextField
											fullWidth
											variant="outlined"
											id="name"
											onChange={(e) => this.onChange(e, "name")}
											value={name}
											error={errors.name}
											type="text"
											helperText={errors.name}
										// className={classnames("", {
										// 	invalid: errors.title
										// })}
										/>
									</Grid>
									<Grid item>
										<Typography
											component="label"
											for="description"
											color="primary"
										>
											Deskripsi
									</Typography>
										<TextField
											fullWidth
											multiline
											rows="5"
											rowsMax="25"
											variant="outlined"
											id="description"
											onChange={(e) => this.onChange(e, "description")}
											value={description}
											error={errors.description}
											type="text"
											helperText={errors.description}
										// className={classnames("", {
										// 	invalid: errors.description
										// })}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Divider
								flexItem
								orientation="vertical"
								className={classes.divider}
							/>
							<Grid item xs={12} md className={classes.content}>
								<Grid container direction="column" spacing={4}>
									<Grid item container spacing={2}>
										<Grid item xs={12} md={6}>
											<Typography
												component="label"
												for="workTime"
												color="primary"
											>
												Waktu Mulai
											</Typography>
											<MuiPickersUtilsProvider
												locale={lokal}
												utils={DateFnsUtils}
											>
												<KeyboardDateTimePicker
													fullWidth
													disablePast
													inputVariant="outlined"
													format="dd/MM/yyyy - HH:mm"
													ampm={false}
													okLabel="Simpan"
													cancelLabel="Batal"
													minDateMessage="Batas waktu harus waktu yang akan datang"
													invalidDateMessage="Format tanggal tidak benar"
													id="workTime"
													value={start_date}
													onChange={(date) =>
														this.onChange(date, "start_date")
													}
												/>
											</MuiPickersUtilsProvider>
										</Grid>
										<Grid item xs={12} md={6}>
											<Typography
												component="label"
												for="workTime"
												color="primary"
											>
												Waktu Selesai
											</Typography>
											<MuiPickersUtilsProvider
												locale={lokal}
												utils={DateFnsUtils}
											>
												<KeyboardDateTimePicker
													fullWidth
													disablePast
													inputVariant="outlined"
													format="dd/MM/yyyy - HH:mm"
													ampm={false}
													okLabel="Simpan"
													cancelLabel="Batal"
													invalidDateMessage="Format tanggal tidak benar"
													id="workTime"
													value={end_date}
													minDate={start_date}
													minDateMessage="Batas waktu harus setelah Waktu Mulai"
													onChange={(date) =>
														this.onChange(date, "end_date")
													}
												/>
											</MuiPickersUtilsProvider>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Divider />
						<div
							style={{ display: "flex", justifyContent: "flex-end" }}
							className={classes.content}
						>
							<div style={{ display: "flex", flexDirection: "row" }}>
								<Button
									variant="contained"
									className={classes.cancelButton}
									onClick={this.handleOpenDeleteDialog}
								>
									Batal
								</Button>
								<Button
									variant="contained"
									type="submit"
									className={classes.createButton}
								>
									Buat Kegiatan
							</Button>
							</div>
						</div>
					</form>
				</Paper>
				<Snackbar
					open={openSnackbar}
					autoHideDuration={3000}
					onClose={(event, reason) => {
						this.handleCloseSnackbar(event, reason);
					}}
				>
					<MuiAlert
						variant="filled"
						severity={severity}
						onClose={(event, reason) => {
							this.handleCloseSnackbar(event, reason);
						}}
					>
						{snackbarContent}
					</MuiAlert>
				</Snackbar>
			</div>
		);
	}

}

const mapStateToProps = (state) => ({
	eventsCollection: state.eventsCollection
});

export default connect(mapStateToProps, {
	getOneEvent
})(withStyles(styles)(EditEvent))
