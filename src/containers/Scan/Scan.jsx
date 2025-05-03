import { Container,Box,Typography,Table,TableContainer,TableHead,TableCell,TableRow,TableBody,IconButton,Paper,Avatar } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AsyncGetScans } from "./ScanSlice";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function Scan()
{

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {scans} = useSelector((state)=>state.scan)
    const {name,role,id} = useSelector((state)=>state.login)
        
    const {t} = useTranslation()

    const handleGoToDocument = (document_id)=>
    {
        navigate(`/document/${document_id}`)
    }

    useEffect(()=>{
        dispatch(AsyncGetScans())
    },[dispatch])

    return(
        <Container>
            <Box sx={{ mt: 3  }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                    {t("Scans")}
                </Typography>
            </Box>
        
            <TableContainer  component={Paper} elevation={2} sx={{ borderRadius: 2,marginBottom:3 }}>
                <Table  sx={{ minWidth: 650 }}>
                <TableHead sx={(theme)=>({ backgroundColor: theme.palette.grey[50] })}>
                    <TableRow>
                    <TableCell>{t("Patient")}</TableCell>
                    <TableCell>{t("Created at")}</TableCell>
                    <TableCell align="right">{t("Actions")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scans.length !== 0 && scans.map((scan) => {
                    const formattedDate = dayjs(scan.createdAt).format("DD-MM-YY HH:mm"); 
                    return (
                        <TableRow key={scan._id} hover>
                        <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={(theme)=>({ bgcolor: theme.palette.info.light, mr: 2 })}>
                                <PersonIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="body2">{name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {role} 
                                </Typography>
                            </Box>
                            </Box>
                        </TableCell>
                        <TableCell>
                            {formattedDate}
                        </TableCell>
                        <TableCell align="right">
                            <IconButton onClick={()=>handleGoToDocument(scan._id)}  size="small">
                                <ImageIcon/>
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