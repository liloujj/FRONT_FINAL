import { Container, Paper, alpha, useTheme, styled, Box as MuiBox, keyframes } from "@mui/material";
import { io } from 'socket.io-client';
import { Box } from "@mui/system";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatContent from "./Components/ChatContent/ChatContent";
import ChatInput from "./Components/ChatInput/ChatInput";
import ChatSideBar from "./Components/ChatSideBar/ChatSideBar";
import { AsyncGetUsers } from "../User/UserSlice";
import { fetchConversationsAsync, fetchMessagesAsync, removeFromNotificationMessage, setSelectedConversation, appendSocketMessage } from "./ChatSlice";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../helpers/socket";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components with lighter colors
const ChatContainer = styled(Container)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease-out`,
}));

const ChatPaper = styled(Paper)(({ theme }) => ({
  padding: '21px',
  marginTop: '24px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(250, 240, 252, 0.95) 0%, rgba(255, 235, 245, 0.95) 100%)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 10px 30px rgba(219, 112, 219, 0.1), 0 1px 3px rgba(219, 112, 219, 0.05)',
  border: '1px solid rgba(255, 182, 193, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #ffb6c1, #dda0dd, #ffb6c1)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 6s infinite linear`,
  },
}));

const ChatLayout = styled(MuiBox)(({ theme }) => ({
  display: 'flex',
  height: '85vh',
  gap: '16px',
}));

const SidebarWrapper = styled(MuiBox)(({ theme }) => ({
  flex: { xs: 4 },
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(219, 112, 219, 0.1)',
}));

const ContentWrapper = styled(MuiBox)(({ theme }) => ({
  display:"flex",
  flexDirection: 'column',
  alignItems: 'stretch',
  width:"100%",
  gap: '16px',
  height: '100%',
}));

const MessagesWrapper = styled(MuiBox)(({ theme }) => ({
  flexGrow: 10,
  borderRadius: '12px',
  overflow: 'auto',
  background: 'rgba(255, 240, 245, 0.8)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 182, 193, 0.3)',
  boxShadow: 'inset 0 2px 10px rgba(219, 112, 219, 0.05)',
  
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 240, 245, 0.5)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(180deg, #ffb6c1, #dda0dd)',
    borderRadius: '10px',
  },
}));

const InputWrapper = styled(MuiBox)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
}));

const admins = [{
  avatar: "/uploads/user.jpeg",
  name: "admin",
  role: "Admin"
}];

export default function Chat() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { messages, selectedConversation } = useSelector((state) => state.chat);
  const { users } = useSelector((state) => state.user);
  const [updateMessages, setUpdateMessages] = useState(false);
  const { role, name, id } = useSelector((state) => state.login);
  const { t } = useTranslation();
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

  useEffect(() => {
    const handleNewMessage = (msg) => {
      const currentConversation = selectedConversationRef.current;
      if (role === "Admin") {
        if (currentConversation?._id === msg.patientId) {
          dispatch(appendSocketMessage(msg));
        }
      } else if (role === "Patient" || role === "Doctor") {
        dispatch(appendSocketMessage(msg));
      }
    };
    
    socket.on("new-message", handleNewMessage);
    
    return () => {
      if (socket) {
        socket.off('new-message');
      }
    };
  }, [socket]);

  const handleSendMessage = (message) => {
    const data = {
      patientId: role === "Admin" ? selectedConversation._id : id,
      content: message,
      sender: role === "Admin" ? "admin" : "patient",
      senderType: role === "Admin" ? "admin" : "patient",
    };
    sendMessage(data);
  };

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    
    let patientId = id;
    if (role === "Admin") {
      dispatch(removeFromNotificationMessage(conversation._id));
      patientId = conversation._id;
    } else {
      dispatch(removeFromNotificationMessage(id));
    }
    
    dispatch(fetchMessagesAsync(patientId));
    
    if (socket) {
      if (role === "Admin") {
        socket.emit("admin-join", { adminId: id, patientId: patientId });
      } else {
        socket.emit("patient-join", patientId);
      }
    }
  };

  const handleChatInputClicked = () => {
    if (updateMessages && selectedConversation) {
      setUpdateMessages(false);
    }
  };

  useEffect(() => {
    dispatch(AsyncGetUsers());
    dispatch(fetchConversationsAsync());
  }, [dispatch]);

  return (
    <ChatContainer maxWidth="lg">
        <ChatLayout>
          <SidebarWrapper>
            <ChatSideBar
              onConversationSelect={handleSelectConversation}
              users={role === "Admin" ? users : admins}
            />
          </SidebarWrapper>
          
          <ContentWrapper>
            <MessagesWrapper>
              <ChatContent 
                messages={messages} 
                conversation={selectedConversation} 
              />
            </MessagesWrapper>
            
            <InputWrapper>
              <ChatInput 
                onSend={handleSendMessage} 
                clicked={handleChatInputClicked} 
                disabled={!selectedConversation} 
              />
            </InputWrapper>
          </ContentWrapper>
        </ChatLayout>
    </ChatContainer>
  );
}