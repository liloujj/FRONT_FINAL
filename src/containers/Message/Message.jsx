import { Container,Paper,alpha,useTheme } from "@mui/material"
import { io } from 'socket.io-client';
import { Box } from "@mui/system"
import { useEffect, useState,useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import ChatContent from "./Components/ChatContent/ChatContent"
import ChatInput from "./Components/ChatInput/ChatInput"
import ChatSideBar from "./Components/ChatSideBar/ChatSideBar"
import { AsyncGetUsers } from "../User/UserSlice"
import { fetchConversationsAsync,fetchMessagesAsync,removeFromNotificationMessage,setSelectedConversation,appendSocketMessage } from "./ChatSlice"
import { useTranslation } from "react-i18next";
import { useSocket } from "../../helpers/socket";

const admins =[{
    avatar: "/uploads/user.jpeg",
    name: "admin",
    role: "Admin"
}]


export default function Chat() {

    const theme = useTheme()
    

    const dispatch = useDispatch()

    const { messages,selectedConversation } = useSelector((state) => state.chat)

    const  {users} = useSelector((state)=>state.user)

    const [updateMessages, setUpdateMessages] = useState(false)
    const  {role,name,id} = useSelector((state)=>state.login)
    
    const {t} = useTranslation()
    const socket = useSocket();
  
    const sendMessage = (message) => {
      if (message && socket) {
        socket.emit('send-message', message);
      }
    };

    const selectedConversationRef = useRef(selectedConversation);

    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);



    useEffect(()=>{
        const handleNewMessage = (msg) => {
            const currentConversation = selectedConversationRef.current;
            if(role==="Admin")
            {
                if (currentConversation?._id===msg.patientId )
                {
                    dispatch(appendSocketMessage(msg))

                }

            }else if (role==="Patient" || role ==="Doctor"){
                dispatch(appendSocketMessage(msg))
            
            }
            
        };
        socket.on("new-message",handleNewMessage)
        return () => {
            if (socket) {
                socket.off('new-message');
            }
        };
    },[socket])

    const handleSendMessage = (message) => {

        const data = {
            patientId:role ==="Admin"?selectedConversation._id:id,
            content: message,
            sender:role ==="Admin"?"admin":"patient",
            senderType:role ==="Admin"?"admin":"patient",
        }
        sendMessage(data)
    }

    const handleSelectConversation = (conversation) => {
        dispatch(setSelectedConversation(conversation))
        
        let patientId = id
        if (role === "Admin")
        {
            dispatch(removeFromNotificationMessage(conversation._id))
            patientId = conversation._id
        }else {
            dispatch(removeFromNotificationMessage(id))
        }
        dispatch(fetchMessagesAsync(patientId))
        if (socket)
        {
            if(role === "Admin")
                {
                socket.emit("admin-join",{adminId:id,patientId:patientId});

            }else{
                socket.emit("patient-join",patientId);

            }
        }
    }

    const handleChatInputClicked = () => {
        if (updateMessages && selectedConversation) {
            setUpdateMessages(false)

        }
    }

    useEffect(() => {
        dispatch(AsyncGetUsers())
        dispatch(fetchConversationsAsync())
        
    }, [dispatch])


    return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
        }}
      >


            <Box display="flex" height="85vh">
                <Box flex={{ xs: 4 }} marginRight={2}>
                    <ChatSideBar
                        onConversationSelect={handleSelectConversation}
                        users={role === "Admin"?users:admins} />
                </Box>
                <Box flex={{ xs: 8 }} display="flex" flexDirection="column" alignItems="stretch">
                    <Box flexGrow="10" sx={{
                        marginBottom: 2,
                        border: "solid 1px #DDD",
                        overflowY: "scroll"
                    }}>
                        <ChatContent messages={messages} conversation={selectedConversation} />
                    </Box>
                    <Box>
                        <ChatInput onSend={handleSendMessage} clicked={handleChatInputClicked} disabled={!selectedConversation} />
                    </Box>
                </Box>
            </Box>
        
            
    </Paper>
        </Container >
    )
}