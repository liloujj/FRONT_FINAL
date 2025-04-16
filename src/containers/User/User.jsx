import { useEffect, useState } from 'react';
import { Typography,InputLabel,TextField,Box,Select,IconButton,InputAdornment,Paper,Table,TableContainer,TableCell,TableRow,TableBody,TableHead,MenuItem,FormControl,ListItemText,Toolbar,Chip,Divider,Badge,Avatar, Container } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AsyncGetUsers } from './UserSlice';
import { useDispatch, useSelector } from 'react-redux';

import dayjs from 'dayjs';


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
              User Management
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="user-filter-label">User Type</InputLabel>
                <Select
                  defaultValue="All"
                  labelId="user-filter-label"
                  label="User Type"
                  onChange={(e) => handleFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="All">All Users</MenuItem>
                  <MenuItem value="Patient">Patients</MenuItem>
                  <MenuItem value="Doctor">Doctors</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Search users..."
                
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
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
      </Container>
      )
}