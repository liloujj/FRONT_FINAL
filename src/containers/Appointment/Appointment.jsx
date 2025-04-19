import { useEffect,useState } from 'react';
import { Typography,InputLabel,Container,TextField,Box,Select,IconButton,Fab,InputAdornment,Paper,Table,TableContainer,TableCell,TableRow,TableBody,TableHead,MenuItem,FormControl,ListItemText,Toolbar,Chip,Divider,Badge,Avatar, Button } from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from "@mui/icons-material/Add"
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AsyncGetAppointments,AsyncGetPatientAppointments,AsyncDeleteAppointment,AsyncAdminApproveAppointment,AsyncAdminRefuseAppointment } from './AppointmentSlice';
import { AsyncGetUsers } from '../User/UserSlice';
import { useDispatch, useSelector } from 'react-redux';

import AppointmentEditDialog from './Dialogs/AppointmentEditDialog';
import dayjs from 'dayjs';



export default function Appointment(){

    const fabStyle = {
      position: 'absolute',
      bottom: 16,
      right: 16,
    };
    const dispatch = useDispatch()

    const  {role,name} = useSelector((state)=>state.login)
    const  {appointments} = useSelector((state)=>state.appointment)
    const  {users} = useSelector((state)=>state.user)
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [model,setModel] = useState(null)
    const [isEditDialogModeUpdate, setEditDialogModeUpdate] = useState(false)
    


    const [filterdAppointments,setFilterdAppointments]= useState(appointments)

    const handleFilter = (value) =>{
        
        if (value !== "All")
        {
            const data = appointments.filter((item)=> item.status === value)
            setFilterdAppointments(data)
        }else{
          setFilterdAppointments(appointments)
        }
    }


    useEffect(()=>{
      setFilterdAppointments(appointments)
    },[appointments])


    const handleDeleteAppointment = (id)=>
    {
      dispatch(AsyncDeleteAppointment(id))
    }

    const handleOpenUpdateDialog= ()=>
    {
      setDeleteDialogOpen(true)
      setEditDialogModeUpdate(true)
    }

    const handleOpenDialog = () =>
    {
        setDeleteDialogOpen(true)
        setEditDialogModeUpdate(false)
    }
    const handleCloseDeleteDialog = (result) => {
        setDeleteDialogOpen(false)

    }

    const handleAdminRefuseAppointment = (id) =>
    {
      dispatch(AsyncAdminRefuseAppointment(id))
    }

    const handleAdminApproveAppointment = (id)=>{
      dispatch(AsyncAdminApproveAppointment(id))
    }

    useEffect(()=>{
        if (role==="Patient")
        {
          dispatch(AsyncGetPatientAppointments())
        }else if (role==="Admin"){
          dispatch(AsyncGetUsers())
          dispatch(AsyncGetAppointments())
        }else{
          dispatch(AsyncGetAppointments())
        }
    },[dispatch])

    return <Container>
        {role === "SuperAdmin" &&
          <Fab
              sx={fabStyle}
              color="primary"
              aria-label="add"
              onClick={handleOpenDialog}
              >
              < AddIcon />
          </Fab>
        }
        <Box sx={{ mt: 3  }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
                Appointment Management
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {role==="Patient" &&
                <Button onClick={handleOpenDialog} variant="contained"> New appointment</Button>
              }
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="user-filter-label">User Type</InputLabel>
                <Select
                  labelId="appointment-filter-label"
                  defaultValue="All"
                  label="Appointment Status"
                  onChange={(e) => handleFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="All">All Appointments</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
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
    
          <TableContainer  component={Paper} elevation={2} sx={{ borderRadius: 2,marginBottom:3 }}>
            <Table  sx={{ minWidth: 650 }}>
              <TableHead sx={(theme)=>({ backgroundColor: theme.palette.grey[50] })}>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterdAppointments.map((appointment) => {
                  const formattedDate = dayjs(appointment.date).format("DD-MM-YY HH:mm");
                  let user;
                  console.log(users)
                  if (role==="Admin")
                  {
                    const users_list = users.filter((element)=>element._id ===appointment.patientID)
                    user = users_list.length === 1 ? users_list[0] : null
                  }
                  else{
                    user = {name,role}
                  }
                  
                  return (
                    <TableRow key={appointment._id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={(theme)=>({ bgcolor: theme.palette.info.light, mr: 2 })}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{user.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.role} 
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                            {formattedDate}
                      </TableCell>
                      <TableCell>{appointment.status}</TableCell>
                      <TableCell align="right">
                        {(role === "Admin" && appointment.status === "Pending") &&
                            <IconButton onClick={()=>handleAdminApproveAppointment(appointment._id)}  size="small">
                              <DoneIcon  fontSize="small" />
                            </IconButton>
                        }
                        {(role === "Admin" && appointment.status === "Pending") &&
                          <IconButton onClick={()=>handleAdminRefuseAppointment(appointment._id)}  size="small">
                            <CloseIcon  fontSize="small" />
                          </IconButton>
                        }
                        {((appointment.status !== "Refused" && appointment.status !== "Approved") && appointment.status !== "Cancelled") &&
                          <IconButton onClick={()=>{handleDeleteAppointment(appointment._id)}} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                        {(appointment.status !== "Refused" && appointment.status !== "Approved")
                          &&
                          <IconButton onClick={()=>
                            {
                              handleOpenUpdateDialog()
                              setModel(appointment)
                            }
                          } size="small">
                            <EditIcon  fontSize="small" />
                          </IconButton>
                        }
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
          isUpdate={isEditDialogModeUpdate}
          model={model}
          open={isDeleteDialogOpen}
          handleClose={handleCloseDeleteDialog} />
        }
      </Container>
}