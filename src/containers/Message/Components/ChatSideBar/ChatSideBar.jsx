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

    const { users, conversations, onConversationSelect, onContactSelect } = props
    const [searchText, setSearchText] = useState("")
    const [elements, setElements] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [openContactList, setOpenContactList] = useState(false)
    const  {role,name,id} = useSelector((state)=>state.login)


    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value)
    }

    const handleSearchInputKeyUp = (event) => {
        const text = event.target.value
        if (!!text) {
            const newElements = conversations.filter((element) => {
                const user = element.conversation_users.find((user) => {
                    return user.id !== element.current_user.id
                })
                const fullName = `${user.name?.toLowerCase()} ${user.last_name?.toLowerCase()}`
                return fullName?.search(text) !== -1
            })
            setElements(newElements)
        } else {
            setElements(conversations)
        }

    }

    const handleClosedContactList = (user) => {
        setOpenContactList(false)
        if (onContactSelect && user) {
            onContactSelect(user)
        }
    }

    const handleAddConversationButtonClicked = () => {
        setOpenContactList(true)
    }

    useEffect(() => {
        setElements(users)
    }, [users])

    return (
        <Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
            <Box sx={{ marginBottom: 2 }} display="flex" flexDirection="row">
                <FormControl variant="outlined" fullWidth={true}>
                    <OutlinedInput
                        fullWidth={true}
                        type="text"
                        value={searchText}
                        onChange={handleSearchInputChange}
                        onKeyUp={handleSearchInputKeyUp}
                        size="small"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    disabled={true}
                                    aria-label="search"
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        placeholder="Type to search..."
                    />
                </FormControl>
                <IconButton sx={{ ml: 1 }} onClick={handleAddConversationButtonClicked}>
                    <AddIcon />
                </IconButton>
            </Box>
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
            <ChatContactList open={openContactList} onClose={handleClosedContactList} users={users} />
        </Box >
    )

}