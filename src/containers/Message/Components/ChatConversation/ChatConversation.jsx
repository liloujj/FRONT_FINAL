import { Avatar, Chip, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material"
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useSelector } from "react-redux"
export default function ChatConversation(props) {

    const { user, clicked, selected } = props

    const { notifications,selectedConversation } = useSelector((state) => state.chat)


    return (
        <ListItemButton
            
            divider={true}
            selected={selected}
            onClick={clicked}
        >
            <ListItemAvatar>
                {
                    user?.avatar ?
                        <Avatar src={user.avatar} /> :
                        <Avatar>{user.name[0]}</Avatar>
                }
            </ListItemAvatar>
            <ListItemText
                primary={`${user.name}`} secondary={(notifications.includes(user._id) &&selectedConversation?._id !== user._id) && <RadioButtonCheckedIcon sx={{fontSize:10}} color="error"/>}
            />
            
        </ListItemButton>
    )
}