import { Avatar, Chip, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material"


export default function ChatConversation(props) {

    const { user, clicked, selected } = props

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
                primary={`${user.name}`}
            />
        </ListItemButton>
    )
}