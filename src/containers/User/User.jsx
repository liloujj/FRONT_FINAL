import { use, useEffect, useState } from 'react';
import { Typography,InputLabel,TextField,Box,Select,IconButton,InputAdornment,Paper,Table,TableContainer,TableCell,TableRow,TableBody,TableHead,MenuItem,FormControl,ListItemText,Toolbar,Chip,Divider,Badge,Avatar, Container } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AsyncGetUsers,AsyncActivateDoctor,AsyncRejectDoctor } from './UserSlice';
import { useDispatch, useSelector } from 'react-redux';

import dayjs from 'dayjs';

import { useTranslation } from "react-i18next";


export default function User(){

    const dispatch = useDispatch()

    const  {users} = useSelector((state)=>state.user)

    const [filterdUsers,setFilterdUsers]= useState(users)

    const handleFilter = (value) =>{
        
        if (value !== "All")
        {
            const data = users.filter((item)=> item.role === value)
            setFilterdUsers(data)
        }else{
            setFilterdUsers(users)
        }
    }
    const {t} = useTranslation()

    const handleActivateDoctor = (doctor_id)=>
    {
      dispatch(AsyncActivateDoctor(doctor_id))
    }

    const handleRejectDoctor=(doctor_id)=>
    {
      dispatch(AsyncRejectDoctor(doctor_id))
    }

    useEffect(()=>{
        dispatch(AsyncGetUsers())
    },[dispatch])

    useEffect(()=>{
        setFilterdUsers(users)
    },[users])

    return (
      <Container>
        <Box sx={{ mt: 3  }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {t("User Management")}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="user-filter-label">{t("User Type")}</InputLabel>
                <Select
                  defaultValue="All"
                  labelId="user-filter-label"
                  label={t("User Type")}
                  onChange={(e) => handleFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="All">{t("All Users")}</MenuItem>
                  <MenuItem value="Patient">{t("Patients")}</MenuItem>
                  <MenuItem value="Doctor">{t("Doctors")}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder={t("Search users...")}
                
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
                  <TableCell>{t("User")}</TableCell>
                  <TableCell>{t("Email")}</TableCell>
                  <TableCell>{t("Phone")}</TableCell>
                  <TableCell>{t("Join Date")}</TableCell>
                  <TableCell>{t("Status")}</TableCell>
                  <TableCell align="right">{t("Actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterdUsers.map((user) => {
                  const formattedDate = dayjs(user.createdAt).format("DD-MM-YY HH:mm");
                  return (
                    <TableRow key={user.id} hover>
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
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.p_phoneNum}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{user.role === "Doctor" && <Chip color={user.isActive ?"success" :"error"} label={user.isActive ?"Enabled" :"Disabeld"}></Chip>}</TableCell>
                      <TableCell align="right">
                        {user.role==="Doctor" && 
                          <IconButton onClick={()=>{user.isActive ?handleRejectDoctor(user._id) :handleActivateDoctor(user._id)}}>
                            {user.isActive ?<CloseIcon/> :<DoneIcon/>}
                          </IconButton>
                        }
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
      </Container>
      )
}