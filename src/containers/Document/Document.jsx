import { Container, IconButton,Box,Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AsyncGetScans } from "../Scan/ScanSlice";
import dayjs from "dayjs";
import { BASE_URL } from "../../configs";

import { useTranslation } from "react-i18next";

export default function Document()
{
    const [scan,setScan] = useState(null)
    const [createdAt,setCreatedAt] = useState(null)
    const {document_id} = useParams()
    const dispatch = useDispatch()
    const {scans} = useSelector((state)=>state.scan)
    const navigate = useNavigate()
    const {t} = useTranslation()

    const handleGoBack = ()=>
    {
        navigate("/scans")
    }

    useEffect(()=>{
        dispatch(AsyncGetScans())
        
    },[dispatch])

    useEffect(()=>{
        const filtered = scans.filter((scan)=>scan._id===document_id)
        if (filtered.length === 1)
        {
            const thisScan = scans.filter((scan)=>scan._id===document_id)[0]
            const date = dayjs(thisScan.createdAt).format("DD-MM-YY HH:mm");
            setScan(thisScan)
            setCreatedAt(date)
        }
    },[scans])

    return(
        <Container>
            <Box sx={{ mt: 3  }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        {t("Document id ")}{scan !== null && scan.id}
                    </Typography>
                    {createdAt !== null &&
                    <Typography>
                        {t("Created at")} {createdAt}
                    </Typography>
                    }
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <IconButton onClick={handleGoBack}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </Box>
                </Box>
                {scan !== null &&
                    <img src={`${BASE_URL}${scan.imageURL}`}/>
                
                }
    
            </Box>
        </Container>
    )
}