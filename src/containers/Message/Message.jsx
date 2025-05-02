import { Container } from "@mui/material"
import { io } from 'socket.io-client';
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ChatContent from "./Components/ChatContent/ChatContent"
import ChatInput from "./Components/ChatInput/ChatInput"
import ChatSideBar from "./Components/ChatSideBar/ChatSideBar"
import { SOCKET_IO_ORIGIN } from "../../configs";
import { AsyncGetUsers } from "../User/UserSlice"
import { fetchConversationsAsync,fetchMessagesAsync,appendMessage } from "./ChatSlice"

export default function Chat() {

    const dispatch = useDispatch()

    const { conversations, messages } = useSelector((state) => state.chat)
    const  {users} = useSelector((state)=>state.user)

    const [selectedConversation, setSelectedConversation] = useState(null)
    const [updateMessages, setUpdateMessages] = useState(false)
    const  {role,name,id} = useSelector((state)=>state.login)
    

    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      const newSocket = io(SOCKET_IO_ORIGIN);
      setSocket(newSocket);
      

      return () => {
        newSocket.disconnect();
      };
    }, []);
  
    const sendMessage = (message) => {
      if (message && socket) {
        socket.emit('send-message', message);
      }
    };


    const handleSendMessage = (message) => {

        const data = {
            patientId:selectedConversation._id,
            content: message,
            sender:role ==="Admin"?"admin":"patient",
            senderType:role ==="Admin"?"admin":"patient",
        }
        sendMessage(data)
        dispatch(appendMessage(data))
    }

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation)
        dispatch(fetchMessagesAsync(conversation._id))
        const patientId = conversation._id
        if (socket)
        {
            socket.emit("admin-join",{id,patientId});

            socket.on(`conversation-${patientId}`, (msg) => {
                console.log(msg)
            });
        }
        //dispatch(clearMessages())
        //dispatch(fetchMessagesByConversationAsync(conversation.id))
    }

    const handleSelectContact = (user) => {
        const filteredConversations = conversations.filter((conversation) => {
            const condition1 = conversation.current_user.id !== user.id
            const condition2 = conversation.conversation_users.map((user) => user.id).indexOf(user._id) !== -1

            return condition1 && condition2
        })

        if (filteredConversations.length > 0) {
            handleSelectConversation(filteredConversations[0])
        } else {
            //dispatch(createConversationAsync({ users: [user.id] }))
        }
    }

    const handleChatInputClicked = () => {
        if (updateMessages && selectedConversation) {
            setUpdateMessages(false)
            //dispatch(fetchMessagesByConversationAsync(selectedConversation.id))
            //dispatch(fetchConversationsAsync())
        }
    }

    useEffect(() => {
        dispatch(AsyncGetUsers())
        dispatch(fetchConversationsAsync())
        
        //dispatch(clearMessages())

    }, [dispatch])

    useEffect(() => {
        if (selectedConversation) {
            messages.forEach((message) => {
                if (message.patientId !== selectedConversation._id && message.status === "UNREAD") {
                    setUpdateMessages(true)
                    //dispatch(updateMessageAsync(message.id, { status: "READ" }))
                }
            })
        }
    }, [messages, selectedConversation, dispatch])

    return (
        <Container>
            <Box display="flex" height="85vh">
                <Box flex={{ xs: 4 }} marginRight={2}>
                    <ChatSideBar
                        conversations={conversations}
                        onConversationSelect={handleSelectConversation}
                        onContactSelect={handleSelectContact}
                        users={users} />
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
        </Container >
    )
}