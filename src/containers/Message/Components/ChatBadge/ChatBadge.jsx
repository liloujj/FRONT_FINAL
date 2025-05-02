import { IconButton, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MQTT_BROKER_URL, MQTT_BROKER_WEB_PORT, MQTT_PASSWORD, MQTT_USERNAME } from "../../../../configs";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


export default function ChatBadge() {

    const [counter, setCounter] = useState(0)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [client] = useState(() => {
        return new Client(MQTT_BROKER_URL, MQTT_BROKER_WEB_PORT, "/ws", `admin${Number(Math.random() * 100)}`)
    })

    const { conversations } = useSelector((state) => state.chat)

    const handleClicked = () => {
        navigate("/chat")
    }


    useEffect(() => {
        //dispatch(fetchConversationsAsync())
    }, [dispatch])

    useEffect(() => {
        if (conversations.length > 0) {
            setCounter(conversations.reduce((a, b) => a + b.num_unread_messages, 0))
        }
    }, [conversations])

    return <IconButton
        color="inherit"
        onClick={handleClicked}
    >
        {counter > 0 ? <Badge badgeContent={counter} color="secondary">
            <ChatIcon />
        </Badge> : <ChatIcon />}
    </IconButton>
} 