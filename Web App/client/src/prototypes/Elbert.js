import React from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles"; 
import { Grid, Paper, Typography, Button, Dialog, DialogTitle, List, ListItem, ListItemText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: "auto",
		maxWidth: "92%"
	},
	Paper: {
		height: theme.spacing(20),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	}
}));

function Elbert() {
	const classes = useStyles();
	const theme = useTheme();

	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState("");

	const handleClickOpen = (name) => {
		setOpen(true);
		setSelected(name);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// daftar orang beserta informasinya
	let people = [
		{nama: "Anna", gender: "Wanita", alamat: "Jl. Tubagus Ismail XVI No.1", tanggalLahir: "8 Juni 1984", hobi: "Main musik"},
		{nama: "Bob", gender: "Pria", alamat: "Jl. Tamansari No.64", tanggalLahir: "1 April 1999", hobi: "Panahan"},
		{nama: "Charlie", gender: "Pria", alamat: "Jl. Tanjung Duren Raya No.4", tanggalLahir: "28 Januari 1986", hobi: "Tidur"},
		{nama: "Douglas", gender: "Pria", alamat: "Jl. Radiul No.7", tanggalLahir: "17 September 1987", hobi: "Berselancar"},
		{nama: "Elizabeth", gender: "Wanita", alamat: "Jl. Diponegoro No.22", tanggalLahir: "20 Juli 1969", hobi: "Snorkeling"},
		{nama: "Farrah", gender: "Wanita", alamat: "Jl. Pratama No.168", tanggalLahir: "17 Agustus 1945", hobi: "Paragliding"}
	];

	// berisi kartu-kartu yang akan ditampilkan
	let paper_list = [];

	//warna-warna latar belakang kartu
	let papers_color = [theme.palette.primary.dark, theme.palette.secondary.dark, theme.palette.error.dark, theme.palette.warning.dark, theme.palette.info.dark, theme.palette.success.dark];
	
	// membuat kartu untuk setiap orang, lalu menyimpannya ke 'paper_list'
	people.forEach((person, idx) =>	{
		paper_list.push(
			<Grid item xs={6} sm={4}>
				<Paper className={classes.Paper} style={{backgroundColor: papers_color[idx%6]}}>
					<Typography variant="h4" style={{color: "white"}}>{person.nama}</Typography>
					<Button variant="contained" size="small" style={{marginTop: "10px"}} onClick={() => {handleClickOpen(person.nama)}}>Info</Button>
				</Paper>
			</Grid>
		)
	});

	
	// mencari informasi orang yang terpilih 
	let info;

	if (!selected) { // jika belum ada orang yang dipilih, 'info' akan diisi info kosong
		info = {nama: "", gender: "", alamat: "", tanggalLahir: "", hobi: ""};
	} else {
		info = people.find((person) => {return(person.nama === selected)});
	}

	let info_list = (
		<List>
			<ListItem><ListItemText primary={`Gender: ${info.gender}`} /></ListItem>
			<ListItem><ListItemText primary={`Alamat: ${info.alamat}`} /></ListItem>
			<ListItem><ListItemText primary={`Tanggal Lahir: ${info.tanggalLahir}`} /></ListItem>
			<ListItem><ListItemText primary={`Hobi: ${info.hobi}`} /></ListItem>
		</List>
	);


	return (
		<div className={classes.root}>
			{/* kumpulan kartu nama */}
			<Grid container spacing={3}>
				{paper_list}
			</Grid>

			{/* dialog yang berisi informasi */}
			<Dialog fullWidth={true} maxWidth="xs" onClose={handleClose} open={open}>
				<DialogTitle>Informasi</DialogTitle>
				{info_list}
			</Dialog>
		</div>
	)
}

export default Elbert;