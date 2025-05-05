import { useEffect, useState } from 'react';

import { Typography,InputLabel,TextField,Box,Select,IconButton,InputAdornment,Paper,Table,TableContainer,TableCell,TableRow,TableBody,TableHead,MenuItem,FormControl,ListItemText,Toolbar,Chip,Divider,Badge,Avatar, Container } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';

import dayjs from 'dayjs';

import { useTranslation } from "react-i18next";
import { AsyncgetAllDoctors } from './PaymentSlice';

export default function Doctors(){

    const dispatch = useDispatch()

    const  {doctors,isPatientPremium} = useSelector((state)=>state.payment)
    const [filterdUsers,setFilterdUsers]= useState(doctors)

    const {t} = useTranslation()

    useEffect(()=>{
        if (isPatientPremium)
        {
            dispatch(AsyncgetAllDoctors())
        }
    },[dispatch])


    useEffect(()=>{
        setFilterdUsers(doctors)
    },[doctors])

    return (
      <Container>
        <Box sx={{ mt: 3  }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {t("Doctors")}
            </Typography>
          </Box>
          {isPatientPremium && 
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
                      <TableCell>{user.role === "Doctor" && <Chip color={user.isActive ?"success" :"error"} label={user.isActive ?t("Enabled") :t("Disabled")}></Chip>}</TableCell>
                      <TableCell align="right">
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          }
          {!isPatientPremium && 
            <Typography mt={5} variant="h5">
                {t("You should upgrade to premium to get this feature")}
            </Typography>
          }
        </Box>
      </Container>
      )
}