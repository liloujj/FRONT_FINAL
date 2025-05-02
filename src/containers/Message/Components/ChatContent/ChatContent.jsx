import { Box } from "@mui/system";
import { Client } from "paho-mqtt";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { MQTT_BROKER_URL, MQTT_BROKER_WEB_PORT, MQTT_PASSWORD, MQTT_USERNAME } from "../../../../configs";
import { appendMessage } from "../../ChatSlice";
import ChatMessage from "../ChatMessage/ChatMessage";

export default function ChatContent(props) {

    const ref = useRef(null)
    const dispatch = useDispatch()
    const { messages, conversation } = props
    const [client] = useState(() => {
        return new Client(MQTT_BROKER_URL, MQTT_BROKER_WEB_PORT, "/ws", `admin${Number(Math.random() * 100)}`)
    })

    useEffect(() => {
        ref.current.scrollIntoView({ block: "end" })
    }, [messages])

    useEffect(() => {
        if (conversation) {
            if (!client.isConnected()) {

                client.onConnectionLost = (message) => {
                    console.log(message)
                }

                client.onMessageArrived = (message) => {
                    if (message.topic === `/messages/${conversation.current_user.id}`) {
                        const msg = JSON.parse(message.payloadString)
                        dispatch(appendMessage(msg))
                    }
                }

                client.connect({
                    reconnect: true,
                    cleanSession: true,
                    keepAliveInterval: 600,
                    userName: MQTT_USERNAME,
                    password: MQTT_PASSWORD,
                    onSuccess: () => {
                        client.subscribe(`/messages/${conversation.current_user.id}`)
                    },
                })
            }
        }

        return () => {
            if (client.isConnected()) {
                client.disconnect()
            }
        }
    }, [client, conversation, dispatch])


    return <Box ref={ref}>
        {messages?.map((message) => {
            return <ChatMessage key={message.id} message={message} />
        })}
    </Box>
}