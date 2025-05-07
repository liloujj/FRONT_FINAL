import { IconButton, Badge,Tooltip,useTheme } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat"
import MessageIcon from '@mui/icons-material/Message';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";



export default function ChatBadge() {

    const navigate = useNavigate()
    const { notifications } = useSelector((state) => state.chat)

    const handleClicked = () => {
        navigate("/messages")
    }
    const theme = useTheme()

    return (
        <Tooltip >
            <IconButton
                color="inherit"

                onClick={handleClicked}
            >
                {notifications.length > 0 ? <Badge badgeContent={notifications.length} >
                    <MessageIcon sx={{color:"white"}} htmlColor="white" />
                </Badge> : <MessageIcon sx={{color:"white"}} htmlColor="white" />}
            </IconButton>
        </Tooltip>
    )
} 