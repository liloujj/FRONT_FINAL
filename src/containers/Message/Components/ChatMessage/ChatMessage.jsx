import { ListItem, Avatar, ListItemAvatar, ListItemText, Typography } from "@mui/material"


export default function ChatMessage(props) {

    const { message } = props

    return (
        <ListItem
            alignItems="flex-start"
        >
            <ListItemAvatar>
                {
                    message?.sender &&
                        <Avatar>{message?.sender[0]}</Avatar>
                }
            </ListItemAvatar>
            <ListItemText
                primary={<>
                    <Typography component="span" variant="subtitle2">
                        {message?.sender} {""}
                        <Typography variant="caption">
                            {message.timestamps}
                        </Typography>
                    </Typography>
                    <Typography component="pre" variant="body2">
                        {message.content}
                    </Typography>
                </>}
            />
        </ListItem>
    )
}