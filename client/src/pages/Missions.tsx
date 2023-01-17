import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Toolbar,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { ListMenu } from "../components/ListMenu";

type SortField = "Title" | "Date" | "Operator";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}

const getMissions = async (
  sortField: SortField,
  sortDesc?: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
  {
    Missions(
      sort: {
        field: ${sortField}
        desc: ${sortDesc}
      }
    ) {
      id
      title
      operator
      launch {
        date
      }
    }
  }
  `,
    []
  );
};
const addMission = async (
  title: String,
  operator: String,
  // tempLaunchDate: Date,
  vehicle: String,
  name: String,
  longitude: Number,
  latitude: Number,
  periapsis: Number,
  apoapsis: Number,
  inclination: Number,
  capacity: Number,
  available: Number
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `mutation{
      createMission(mission:{title: "${title}",
        operator: "${operator}",
        launch: {
          date: "2022-12-26T09:32:40.000Z",
          vehicle: "${vehicle}",
          location: {
            name: "${name}",
            longitude: ${longitude},
            latitude: ${latitude},
          }
        },
        orbit: {
          periapsis: ${periapsis},
          apoapsis: ${apoapsis},
          inclination: ${inclination},
        },
        payload: {
          capacity: ${capacity},
          available: ${available},
        }}){
        id
      }
    }
		`,
    []
  );
};
const removeMission = async (
  id: String
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    mutation($id: ID!){
     removeMission(id: $id){
        id
        title
        operator
        launch{
          date
        }
      }
    }
    `,
    {id:id}
  );
};
// const editMission = async (
//   id?: String | null,
//   title?: String | null,
//   operator?: String | null
// ): Promise<MissionsResponse> => {
//   return await fetchGraphQL(
//     `
//     mutation{
//       editMission(
//         id: "${id}",
//         mission:{
//           title: "${title}",
//         operator: "${operator}",
//         launch: {
//           date: "2022-12-26T09:32:40.000Z",
//           vehicle: "Vulture 9",
//           location: {
//             name: "Cape Canaveral SLC-40",
//             longitude: -80.57718,
//             latitude: -28.562106
//           }
//         },
//         orbit: {
//           periapsis: 200,
//           apoapsis: 300,
//           inclination: 36
//         },
//         payload: {
//           capacity: 22000,
//           available: 7000
//         }}){
//           id
//           title
//           operator
//           launch {
//             date
//           }
//       }
//     }
//     `,
//     {id:id}
//     // {id:id, title:title,operator:operator,date:date,vehicle:vehicle,name:name,longitude:longitude,latitude:latitude,periapsis:periapsis,apoapsis:apoapsis,inclination:inclination,capacity:capacity,available:available}
//   );
// };
const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [editMissionOpen, setEditMissionOpen] = useState(false);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");

  const [idToEdit, setIdToEdit] = useState<String | undefined>("idToEdit");


  const [title, setTitle] = useState<String>("title");
  const [titleEdited, setTitleEdited] = useState<String>("titleEdited");
  const [operator, setOperator] = useState<String>("operator");
  const [operatorEdited, setOperatorEdited] = useState<String>("operatorEdited");
  const [vehicle, setVehicle] = useState<String>("vehicle");
  const [name, setName] = useState<String>("name");
  const [longitude, setLongitude] = useState<Number>(0);
  const [latitude, setLatitude] = useState<Number>(0);
  const [periapsis, setPeriapsis] = useState<Number>(0);
  const [apoapsis, setApoapsis] = useState<Number>(0);
  const [inclination, setInclination] = useState<Number>(0);
  const [capacity, setCapacity] = useState<Number>(0);
  const [available, setAvailable] = useState<Number>(0);

  const [errMessage, setErrMessage] = useState<String | null>(null);

  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };
  const handleNewMissionOpen = () => {
    setTempLaunchDate(null);
    setNewMissionOpen(true);
  };
  const handleEditMissionOpen = (idToEdit: String | undefined) => {
    setEditMissionOpen(true);
    setIdToEdit(idToEdit);
  };
  const handleNewMissionClose = () => {
    setNewMissionOpen(false);
  };
  const handleEditMissionClose = () => {
    setEditMissionOpen(false);
  };
  const handleNewMissionSave = async (event: SyntheticEvent) => {
    if (title && operator) {
      await addMission(
        title,
        operator,
        // tempLaunchDate,
        vehicle,
        name,
        longitude,
        periapsis,
        apoapsis,
        inclination,
        capacity,
        available,
        latitude
      );
      handleNewMissionClose();
      getMissions(sortField, sortDesc)
        .then((result: MissionsResponse) => {
          setMissions(result.data.Missions);
        })
        .catch((err) => {
          setErrMessage("Failed to load missions.");
          console.log(err);
        });
    }
  };
  const handleEditMissionSave = async (event: SyntheticEvent | null) => {
    setEditMissionOpen(false);
    // await editMission(
    //    idToEdit,
    //    titleEdited,
    //    operatorEdited
    //    ).then((res: MissionsResponse) => {
    //     console.log('res.data123   ## ', res.data);
    //   //  setMissions(res.data.ed);
    //  })
    //  .catch((err) => {
    //    setErrMessage("Failed to load edited missions.");
    //    console.log(err);
    //  });
    //  handleEditMissionClose();
     getMissions(sortField, sortDesc)
  };
  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };
  const handleTitleChange = (event: Event | any) => {
    setTitle(event.target.value);
  };
  const handleOperatorChange = (event: Event | any) => {
    setOperator(event.target.value);
  };
  const handleVehicleChange = (event: Event | any) => {
    setVehicle(event.target.value);
  };
  const handleNameChange = (event: Event | any) => {
    setName(event.target.value);
  };
  const handleLongitudeChange = (event: Event | any) => {
    setLongitude(event.target.value);
  };
  const handleLatitudeChange = (event: Event | any) => {
    setLatitude(event.target.value);
  };
  const handlePeriapsisChange = (event: Event | any) => {
    setPeriapsis(event.target.value);
  };
  const handleApoapsisChange = (event: Event | any) => {
    setApoapsis(event.target.value);
  };
  const handleInclinationChange = (event: Event | any) => {
    setInclination(event.target.value);
  };
  const handleCapacityChange = (event: Event | any) => {
    setCapacity(event.target.value);
  };
  const handleAvailableChange = (event: Event | any) => {
    setAvailable(event.target.value);
  };
  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };
  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };

  const handleRemoveMission = (id: String) => {
    removeMission(id).
      then((res: any) => {
        setMissions(res.data.removeMission);
      })
      .catch((err) => {
        setErrMessage("Failed to remove mission.")
        console.log(err);
      });
  };
  const handleOperatorEditedChange = (event: Event | any) => {
    setOperatorEdited(event.target.value);
  };
  const handleTitleEditedChange = (event: Event | any) => {
    setTitleEdited(event.target.value);
  };
  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc, title]);

  return (
    <AppLayout title="Missions">
       <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>
        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton onClick={handleSortDescClick}>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((mission: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={mission.title}
                    subheader={new Date(mission.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{mission.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => handleEditMissionOpen(mission.id)}>Edit</Button>
                    <IconButton onClick={() => handleRemoveMission(mission.id!)}>
                      <DeleteIcon />
                    </IconButton>
                   </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        <Tooltip title="New Mission">
          <Fab
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            color="primary"
            aria-label="add"
            onClick={handleNewMissionOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Dialog
          open={newMissionOpen}
          onClose={handleNewMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>New Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="title"
                  label="Title"
                  variant="standard"
                  fullWidth
                  onChange={handleTitleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="operator"
                  label="Description"
                  variant="standard"
                  fullWidth
                  onChange={handleOperatorChange}
                />
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    // minTime={new Date()}
                    label="Launch Date"
                    value={tempLaunchDate}
                    onChange={handleTempLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="vehicle"
                  label="Vehicle"
                  variant="standard"
                  fullWidth
                  onChange={handleVehicleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  label="Location Name"
                  variant="standard"
                  fullWidth
                  onChange={handleNameChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="longitude"
                  label="longitude"
                  variant="standard"
                  fullWidth
                  onChange={handleLongitudeChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="latitude"
                  label="latitude"
                  variant="standard"
                  fullWidth
                  onChange={handleLatitudeChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="periapsis"
                  label="periapsis"
                  variant="standard"
                  fullWidth
                  onChange={handlePeriapsisChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="apoapsis"
                  label="apoapsis"
                  variant="standard"
                  fullWidth
                  onChange={handleApoapsisChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="inclination"
                  label="inclination"
                  variant="standard"
                  fullWidth
                  onChange={handleInclinationChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="capacity"
                  label="capacity"
                  variant="standard"
                  fullWidth
                  onChange={handleCapacityChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="available"
                  label="available"
                  variant="standard"
                  fullWidth
                  onChange={handleAvailableChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewMissionClose}>Cancel</Button>
            <Button onClick={handleNewMissionSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editMissionOpen}
          onClose={handleEditMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="titleEdited"
                  label="Title"
                  variant="standard"
                  fullWidth
                  onChange={handleTitleEditedChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="operatorEdited"
                  label="Description"
                  variant="standard"
                  fullWidth
                  onChange={handleOperatorEditedChange}
                />
              </Grid>
            </Grid>
           </DialogContent>
          <DialogActions>
            <Button onClick={handleEditMissionClose}>Cancel</Button>
            <Button onClick={handleEditMissionSave}>Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export { Missions };
