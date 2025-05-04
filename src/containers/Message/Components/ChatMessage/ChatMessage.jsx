import { ListItem, Avatar, ListItemAvatar, ListItemText, Typography } from "@mui/material"

import { useSelector } from "react-redux"
export default function ChatMessage(props) {

    const { message } = props
    const  {role} = useSelector((state)=>state.login)

    return (
        <div
            style={{direction:message.sender ==="admin"?"ltr":"rtl"}}
        >
            <ListItem
                
            >   
                <ListItemAvatar>
                    {
                        message?.sender &&
                            <Avatar>{message?.sender[0]}</Avatar>
                    }
                </ListItemAvatar>
                <ListItemText
                    sx={{textAlign:message.sender ==="admin"?"left":"right"}}
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

        </div>
    )
}