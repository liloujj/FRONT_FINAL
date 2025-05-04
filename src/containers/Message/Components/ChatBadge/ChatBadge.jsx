import { IconButton, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


export default function ChatBadge() {

    const navigate = useNavigate()
    const { notifications } = useSelector((state) => state.chat)

    const handleClicked = () => {
        navigate("/messages")
    }

    return <IconButton
        color="inherit"
        onClick={handleClicked}
    >
        {notifications.length > 0 ? <Badge badgeContent={notifications.length} color="secondary">
            <ChatIcon />
        </Badge> : <ChatIcon />}
    </IconButton>
} 