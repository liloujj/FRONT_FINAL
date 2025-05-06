import { ListItem, Avatar, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
export default function ChatMessage(props) {

    const { message } = props

    const  {role,name,id} = useSelector((state)=>state.login)
    
    const [patientName,setPatientName] = useState(null)

    const  {users} = useSelector((state)=>state.user)
    const getName = ()=>{
        let patient = users.filter(user=>user._id === message.patientId)
        if (patient.length === 1){
            patient = patient[0]
            setPatientName(patient.name)
        }
    }

    useEffect(()=>{
        getName()
    },[])

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
                        {(message?.sender === "patient" && (role === "Patient"||role === "Doctor" )) && name}
                        {(message?.sender === "admin" ) && "admin"}
                        {(message?.sender ==="patient" && message.patientId !== id && role === "Admin" ) && patientName}
                            <Typography variant="caption">
                                {message?.timestamps}
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