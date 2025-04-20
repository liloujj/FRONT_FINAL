import { Container,Box,Typography,Grid, Paper,Button } from "@mui/material"

import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AsyncGetAppointments } from "../Appointment/AppointmentSlice";
import { AsyncGetUsers } from "../User/UserSlice";
import { AsyncGetNotifications } from "../Notification/NotificationSlice";
import ScanUploadDialog from "./Dialogs/ScanUploadDialog";

export default function Dashboard(){

    const dispatch = useDispatch()

    const {users} = useSelector((state)=>state.user)
    const {notifications} = useSelector((state)=>state.notification)
    const {appointments} = useSelector((state)=>state.appointment)

    const [scanDialogOpen,setScanDialogOpen] = useState(false)

    useEffect(()=>{
        dispatch(AsyncGetAppointments())
        dispatch(AsyncGetUsers())
        dispatch(AsyncGetNotifications())

    },[dispatch])



    return(
        <Container>
            <Box mt={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>                
                    <Typography textAlign="left" variant="h5" component="h2" fontWeight="bold" gutterBottom >
                        {"Dashboard"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button  onClick={()=>setScanDialogOpen(true)} variant="contained" >Upload scan</Button> 
                    </Box>
                </Box>
            </Box>
            <Grid container spacing={2} sx={{mt:3}}>
                <Grid item size={4}>
                    <Paper sx={{padding:2}}>
                        <PersonIcon sx={{fontSize:50}}/>
                        <Typography sx={{mt:1}} variant="h5">{users.length} Users</Typography>
                    </Paper>
                </Grid>
                <Grid item size={4}>
                    <Paper sx={{padding:2}}>
                        <NotificationsIcon sx={{fontSize:50}}/>
                        <Typography sx={{mt:1}} variant="h5">{notifications.length} Notifications</Typography>
                    </Paper>
                </Grid>
                <Grid item size={4}>
                    <Paper sx={{padding:2}}>
                        <CalendarMonthIcon sx={{fontSize:50}}/>
                        <Typography sx={{mt:1}} variant="h5">{appointments.length} Appointments</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <ScanUploadDialog list={users.filter((user)=>user.role==="Patient")} open={scanDialogOpen} handleClose={()=>{setScanDialogOpen(false)}} />
        </Container>
    )
}