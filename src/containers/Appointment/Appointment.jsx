import { useEffect,useState } from 'react';
import { Typography,InputLabel,Container,TextField,Box,Select,IconButton,Fab,InputAdornment,Paper,Table,TableContainer,TableCell,TableRow,TableBody,TableHead,MenuItem,FormControl,ListItemText,Toolbar,Chip,Divider,Badge,Avatar } from '@mui/material';

import AddIcon from "@mui/icons-material/Add"
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AsyncGetAppointments } from './AppointmentSlice';
import { useDispatch, useSelector } from 'react-redux';

import AppointmentEditDialog from './Dialogs/AppointmentEditDialog';



export default function Appointment(){

    const fabStyle = {
      position: 'absolute',
      bottom: 16,
      right: 16,
    };
    const dispatch = useDispatch()

    const  {role} = useSelector((state)=>state.login)
    const  {appointments} = useSelector((state)=>state.appointment)
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)


    const handleOpenDialog = () =>
    {
        setDeleteDialogOpen(true)
    }
    const handleCloseDeleteDialog = (result) => {
        setDeleteDialogOpen(false)

    }

    useEffect(()=>{
        dispatch(AsyncGetAppointments())
    },[appointments])

    return <Container>
        {role === "Patient" &&
          <Fab
              sx={fabStyle}
              color="primary"
              aria-label="add"
              onClick={handleOpenDialog}
              >
              < AddIcon />
          </Fab>
        }
        <Box sx={{ mt: 3 ,paddingLeft:3,paddingRight:3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
                Appointment Management
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="user-filter-label">User Type</InputLabel>
                <Select
                  labelId="user-filter-label"
                  label="User Type"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="All Users">All Appointments</MenuItem>
                  
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Search appointments..."
                
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
    
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={(theme)=>({ backgroundColor: theme.palette.grey[50] })}>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => {
                  return (
                    <TableRow key={appointment.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={(theme)=>({ bgcolor: theme.palette.info.light, mr: 2 })}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{appointment.patient.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.patient.role}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.status}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {isDeleteDialogOpen && 
        <AppointmentEditDialog 
          open={isDeleteDialogOpen}
          handleClose={handleCloseDeleteDialog} />
        }
      </Container>
}