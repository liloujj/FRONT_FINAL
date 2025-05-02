import { Container } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearMessages, createConversationAsync, createMessageAsync, fetchContactsAsync, fetchConversationsAsync, fetchMessagesByConversationAsync, updateMessageAsync } from "./ChatSlice"
import ChatContent from "./Components/ChatContent/ChatContent"
import ChatInput from "./Components/ChatInput/ChatInput"
import ChatSideBar from "./Components/ChatSideBar/ChatSideBar"

export default function Chat() {

    const dispatch = useDispatch()

    const { users, conversations, messages } = useSelector((state) => state.chat)
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [updateMessages, setUpdateMessages] = useState(false)

    const handleSendMessage = (message) => {
        const data = {
            content: message,
            user_id: selectedConversation.current_user.id,
            conversation_id: selectedConversation.id
        }
        //dispatch(createMessageAsync(data))
        //dispatch(fetchConversationsAsync())
    }

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation)
        //dispatch(clearMessages())
        //dispatch(fetchMessagesByConversationAsync(conversation.id))
    }

    const handleSelectContact = (user) => {
        // This works because we don't have group chat,
        // later change this when we support group chat.
        const filteredConversations = conversations.filter((conversation) => {
            const condition1 = conversation.current_user.id !== user.id
            const condition2 = conversation.conversation_users.map((user) => user.id).indexOf(user.id) !== -1

            return condition1 && condition2
        })

        if (filteredConversations.length > 0) {
            handleSelectConversation(filteredConversations[0])
        } else {
            //dispatch(createConversationAsync({ users: [user.id] }))
        }
    }

    const handleChatInputClicked = () => {
        if (updateMessages && selectedConversation) {
            setUpdateMessages(false)
            //dispatch(fetchMessagesByConversationAsync(selectedConversation.id))
            //dispatch(fetchConversationsAsync())
        }
    }

    useEffect(() => {
        //dispatch(clearMessages())
        //dispatch(fetchContactsAsync())
        //dispatch(fetchConversationsAsync())
    }, [dispatch])

    useEffect(() => {
        if (selectedConversation) {
            messages.forEach((message) => {
                if (message.user_id !== selectedConversation.current_user.id && message.status === "MessageStatus.UNREAD") {
                    setUpdateMessages(true)
                    //dispatch(updateMessageAsync(message.id, { status: "READ" }))
                }
            })
        }
    }, [messages, selectedConversation, dispatch])


    return (
        <Container>
            <Box display="flex" height="85vh">
                <Box flex={{ xs: 4 }} marginRight={2}>
                    <ChatSideBar
                        conversations={conversations}
                        onConversationSelect={handleSelectConversation}
                        onContactSelect={handleSelectContact}
                        users={users} />
                </Box>
                <Box flex={{ xs: 8 }} display="flex" flexDirection="column" alignItems="stretch">
                    <Box flexGrow="10" sx={{
                        marginBottom: 2,
                        border: "solid 1px #DDD",
                        overflowY: "scroll"
                    }}>
                        <ChatContent messages={messages} conversation={selectedConversation} />
                    </Box>
                    <Box>
                        <ChatInput onSend={handleSendMessage} clicked={handleChatInputClicked} disabled={!selectedConversation} />
                    </Box>
                </Box>
            </Box>
        </Container >
    )
}