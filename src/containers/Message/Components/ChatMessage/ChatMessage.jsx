import { 
    ListItem, 
    Avatar, 
    ListItemAvatar, 
    ListItemText, 
    Typography,
    styled,
    Box,
    Paper
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  
  // Styled components with lighter colors
  const MessageContainer = styled('div')(({ theme, isAdmin }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: isAdmin ? 'flex-start' : 'flex-end',
    marginBottom: '8px',
    maxWidth: '100%',
    direction: isAdmin ? 'ltr' : 'rtl',
  }));
  
  const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: '4px 8px',
    width: 'auto',
    maxWidth: '85%',
  }));
  
  const MessageBubble = styled(Paper)(({ theme, isAdmin }) => ({
    padding: '10px 16px',
    borderRadius: isAdmin ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
    background: isAdmin 
      ? 'linear-gradient(135deg, #f0e6ff 0%, #fce6f5 100%)' 
      : 'linear-gradient(135deg, #fce6f5 0%, #f0e6ff 100%)',
    boxShadow: '0 2px 6px rgba(186, 104, 200, 0.15)',
    position: 'relative',
    marginLeft: isAdmin ? '8px' : '0',
    marginRight: isAdmin ? '0' : '8px',
    border: '1px solid rgba(186, 104, 200, 0.1)',
  }));
  
  const StyledAvatar = styled(Avatar)(({ theme, isAdmin }) => ({
    background: isAdmin 
      ? 'linear-gradient(135deg, #ba68c8 0%, #ff69b4 100%)' 
      : 'linear-gradient(135deg, #ff69b4 0%, #ba68c8 100%)',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '2px solid white',
  }));
  
  const MessageHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '4px',
  }));
  
  const SenderName = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: '#7b2cbf',
  }));
  
  const TimeStamp = styled(Typography)(({ theme }) => ({
    color: 'rgba(123, 44, 191, 0.6)',
    fontSize: '0.75rem',
    marginLeft: '8px',
  }));
  
  const MessageContent = styled(Typography)(({ theme }) => ({
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#333',
    lineHeight: 1.5,
    fontFamily: 'inherit',
  }));
  
  export default function ChatMessage(props) {
    const { message } = props;
    const { role, name, id } = useSelector((state) => state.login);
    const [patientName, setPatientName] = useState(null);
    const { users } = useSelector((state) => state.user);
    
    const isAdmin = message.sender === "admin";
    
    const getName = () => {
      let patient = users.filter(user => user._id === message.patientId);
      if (patient.length === 1) {
        patient = patient[0];
        setPatientName(patient.name);
      }
    };
  
    useEffect(() => {
      getName();
    }, []);
    
    // Determine the display name
    let displayName = "";
    if (message?.sender === "patient" && (role === "Patient" || role === "Doctor")) {
      displayName = name;
    } else if (message?.sender === "admin") {
      displayName = "Admin";
    } else if (message?.sender === "patient" && message.patientId !== id && role === "Admin") {
      displayName = patientName;
    }
  
    return (
      <MessageContainer isAdmin={isAdmin}>
        <StyledListItem>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: isAdmin ? 'row' : 'row-reverse' }}>
            <ListItemAvatar sx={{ minWidth: '40px' }}>
              {message?.sender && (
                <StyledAvatar isAdmin={isAdmin}>
                  {message?.sender[0]?.toUpperCase()}
                </StyledAvatar>
              )}
            </ListItemAvatar>
            
            <MessageBubble isAdmin={isAdmin}>
              <MessageHeader>
                <SenderName variant="subtitle2">
                  {displayName}
                </SenderName>
                <TimeStamp variant="caption">
                  {message?.timestamps}
                </TimeStamp>
              </MessageHeader>
              
              <MessageContent variant="body2">
                {message.content}
              </MessageContent>
            </MessageBubble>
          </Box>
        </StyledListItem>
      </MessageContainer>
    );
  }