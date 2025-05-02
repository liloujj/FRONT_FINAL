import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ChatMessage from "../ChatMessage/ChatMessage";

export default function ChatContent(props) {

    const ref = useRef(null)
    const dispatch = useDispatch()
    const { messages } = props

    useEffect(() => {
        ref.current.scrollIntoView({ block: "end" })
    }, [messages])

    return <Box ref={ref}>
        {messages.length !==0 &&  messages?.map((message) => {
            return <ChatMessage key={message.id} message={message} />
        })}
    </Box>
}