import { 
    FormControl, 
    OutlinedInput, 
    InputAdornment, 
    IconButton, 
    List,
    Typography,
    Divider,
    styled,
    Box,
    Paper,
    alpha,
    Tooltip
  } from "@mui/material";
  import SearchIcon from "@mui/icons-material/Search";
  import AddIcon from "@mui/icons-material/Add";
  import ChatConversation from "../ChatConversation/ChatConversation";
  import React, { useState, useEffect } from "react";
  import ChatContactList from "../ChatContactList/ChatContactList";
  import { useSelector } from "react-redux";
  
  // Styled components
  const SidebarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'linear-gradient(135deg, #2a1a2d 0%, #3a1a3d 100%)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 105, 180, 0.2)',
  }));
  
  const SidebarHeader = styled(Box)(({ theme }) => ({
    padding: '16px',
    background: 'linear-gradient(90deg, rgba(186, 104, 200, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%)',
    borderBottom: '1px solid rgba(255, 105, 180, 0.2)',
  }));
  
  const HeaderTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: '12px',
    color: 'white',
    textAlign: 'center',
    background: 'linear-gradient(90deg, #ff69b4, #ba68c8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }));
  
  const SearchContainer = styled(FormControl)(({ theme }) => ({
    marginBottom: '8px',
  }));
  
  const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    borderRadius: '12px',
    background: alpha('#2a1a2d', 0.4),
    backdropFilter: 'blur(8px)',
    
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(186, 104, 200, 0.4)',
      borderWidth: 1.5,
    },
    
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 105, 180, 0.6)',
    },
    
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ff69b4',
      borderWidth: 2,
      boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.15)',
    },
    
    '& input': {
      color: 'rgba(255, 255, 255, 0.9)',
      padding: '10px 14px',
      fontSize: '0.9rem',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
        opacity: 1,
      },
    },
  }));
  
  const ActionButton = styled(IconButton)(({ theme }) => ({
    color: '#ff69b4',
    background: 'rgba(255, 105, 180, 0.1)',
    transition: 'all 0.2s ease',
    
    '&:hover': {
      background: 'rgba(255, 105, 180, 0.2)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    
    '&:active': {
      transform: 'translateY(0)',
    },
  }));
  
  const ConversationList = styled(Box)(({ theme }) => ({
    flexGrow: 10,
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(186, 104, 200, 0.5) rgba(255, 255, 255, 0.05)',
    
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '10px',
    },
    
    '&::-webkit-scrollbar-thumb': {
      background: 'linear-gradient(180deg, #ff69b4 0%, #ba68c8 100%)',
      borderRadius: '10px',
    },
  }));
  
  const EmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    height: '100%',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  }));
  
  export default function ChatSideBar(props) {
    const { users, onConversationSelect } = props;
    const [searchText, setSearchText] = useState("");
    const [elements, setElements] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [openContactList, setOpenContactList] = useState(false);
    const { role, name, id } = useSelector((state) => state.login);
  
    const handleSearchInputChange = (event) => {
      setSearchText(event.target.value);
      
      if (event.target.value) {
        const filtered = users.filter((user) => {
          const fullName = user.name?.toLowerCase() || '';
          return fullName.includes(event.target.value.toLowerCase());
        });
        setElements(filtered);
      } else {
        setElements(users);
      }
    };
  
    const handleAddContact = () => {
      setOpenContactList(true);
    };
  
    const handleContactSelected = (contact) => {
      setOpenContactList(false);
      // Add logic to handle new contact selection if needed
    };
  
    useEffect(() => {
      setElements(users);
    }, [users]);
  
    return (
      <SidebarContainer>
        <SidebarHeader>
          <HeaderTitle variant="h6">
            Messages
          </HeaderTitle>
          
          <SearchContainer variant="outlined" fullWidth>
            <StyledOutlinedInput
              fullWidth
              placeholder="Search conversations..."
              value={searchText}
              onChange={handleSearchInputChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 105, 180, 0.7)' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title="New conversation">
                    <ActionButton
                      edge="end"
                      onClick={handleAddContact}
                      size="small"
                    >
                      <AddIcon />
                    </ActionButton>
                  </Tooltip>
                </InputAdornment>
              }
            />
          </SearchContainer>
        </SidebarHeader>
        
        <ConversationList>
          {elements.length > 0 ? (
            <List disablePadding>
              {elements
                ?.filter((element) => element._id !== id)
                .map((user, index) => (
                  <ChatConversation
                    key={user._id || index}
                    user={user}
                    selected={selectedConversation === index}
                    clicked={() => {
                      setSelectedConversation(index);
                      if (onConversationSelect) {
                        onConversationSelect(user);
                      }
                    }}
                  />
                ))}
            </List>
          ) : (
            <EmptyState>
              <Typography variant="body2" sx={{ mb: 2 }}>
                No conversations found
              </Typography>
              <Typography variant="caption">
                Start a new conversation or try a different search
              </Typography>
            </EmptyState>
          )}
        </ConversationList>
        
        <ChatContactList
          open={openContactList}
          onClose={handleContactSelected}
          users={users.filter(user => user._id !== id)}
        />
      </SidebarContainer>
    );
  }