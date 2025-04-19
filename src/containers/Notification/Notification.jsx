import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { Typography,InputLabel,Badge,Container,TextField,Box,Select,IconButton,Fab,InputAdornment,Paper,Table,TableContainer,TableCell,TableRow,TableBody,TableHead,MenuItem,FormControl,ListItemText,Avatar, Button } from '@mui/material';
import { useDispatch,useSelector } from "react-redux";
import { AsyncGetNotifications,AsyncReadNotification,AsyncReadAllNotifications } from "./NotificationSlice";
import { useEffect,useState } from "react";

import dayjs from 'dayjs';

export function Notification()
{

    const dispatch = useDispatch()
    const {notifications} = useSelector((state)=>state.notification)

    useEffect(()=>{
        dispatch(AsyncGetNotifications())
    },[dispatch])
    return (
        <IconButton color="inherit" sx={{ position: "relative" }}>
            <Badge badgeContent={notifications.filter((element)=>element.read===false).length} color="error">
                <NotificationsIcon />
            </Badge>
        </IconButton>   
    )
}


export function NotificationTable(){

    const dispatch = useDispatch()

    const  {role,name} = useSelector((state)=>state.login)
    const  {notifications} = useSelector((state)=>state.notification)
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [model,setModel] = useState(null)
    const [isEditDialogModeUpdate, setEditDialogModeUpdate] = useState(false)

    const [filterdNotifications,setFilterdNotifications]= useState(notifications)

    const handleFilter = (value) =>{
        
        if (value !== "All")
        {
            let data ;
            if (value === "Read")
            {
                data = notifications.filter((item)=> item.read === true)
            }else if (value === "Unread")
            {
                data = notifications.filter((item)=> item.read === false)
            }
            setFilterdNotifications(data)
        }else{
            setFilterdNotifications(notifications)
        }
    }

    const handleReadNotification = (id) =>{
        dispatch(AsyncReadNotification(id))
    }

    const handleReadAllNotifications = ()=>
    {
        dispatch(AsyncReadAllNotifications())
    }


    useEffect(()=>{
        setFilterdNotifications(notifications)
    },[notifications])


    useEffect(()=>{
        dispatch(AsyncGetNotifications())
    },[dispatch])

    return <Container>
        <Box sx={{ mt: 3  }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
                Notifications
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button disabled={notifications.filter((notification)=>notification.read===false).length === 0} onClick={()=>{handleReadAllNotifications()}} variant="contained">Read all</Button>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="notification-filter-label">Notification Type</InputLabel>
                <Select
                  labelId="notification-filter-label"
                  defaultValue="All"
                  label="Notification Status"
                  onChange={(e) => handleFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="All">All Notifications</MenuItem>
                  <MenuItem value="Read">Read</MenuItem>
                  <MenuItem value="Unread">Unread</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
    
          <TableContainer  component={Paper} elevation={2} sx={{ borderRadius: 2,marginBottom:3 }}>
            <Table  sx={{ minWidth: 650 }}>
              <TableHead sx={(theme)=>({ backgroundColor: theme.palette.grey[50] })}>
                <TableRow>
                  <TableCell>Contnet</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterdNotifications.map((notification) => {
                  const formattedDate = dayjs(notification.createdAt).format("DD-MM-YY HH:mm");                  
                  return (
                    <TableRow key={notification._id} hover>
                      <TableCell>
                        {notification.content} 
                      </TableCell>
                      <TableCell>
                            {formattedDate}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={()=>{handleReadNotification(notification._id)}} size="small">
                            {notification.read===true ? <MarkEmailReadIcon/>:<MarkunreadIcon/> }
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
}