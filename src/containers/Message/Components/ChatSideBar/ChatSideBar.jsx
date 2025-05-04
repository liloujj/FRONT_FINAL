import { FormControl, OutlinedInput, InputAdornment, IconButton, List } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import ChatConversation from "../ChatConversation/ChatConversation"
import React, { useState } from "react"
import { useEffect } from "react"
import { Box } from "@mui/system"
import ChatContactList from "../ChatContactList/ChatContactList"

import { useSelector } from "react-redux"


export default function ChatSideBar(props) {

    const { users, onConversationSelect} = props
    const [searchText, setSearchText] = useState("")
    const [elements, setElements] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [openContactList, setOpenContactList] = useState(false)
    const  {role,name,id} = useSelector((state)=>state.login)



    useEffect(() => {
        setElements(users)
    }, [users])

    return (
        <Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
            
            <Box border="solid 1px #ddd" flexGrow="10" sx={{
                overflowY: "scroll",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    display: "none"
                }
            }}>
                {elements.length > 0 &&
                    <List disablePadding={true}>
                        {elements?.filter((element)=>element._id !== id).map((user, index) => {
                            return (
                                <ChatConversation
                                    key={user.id}
                                    user={user}
                                    selected={selectedConversation === index}
                                    clicked={() => {
                                        setSelectedConversation(index)
                                        if (onConversationSelect) {
                                            onConversationSelect(user)
                                        }
                                    }} />
                            )
                        })}
                    </List>
                }
            </Box>
        </Box >
    )

}