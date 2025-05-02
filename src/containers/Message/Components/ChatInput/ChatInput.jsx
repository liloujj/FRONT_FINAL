import { FormControl, OutlinedInput, InputAdornment, IconButton } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import { useState } from "react"
import { useEffect } from "react"


export default function ChatInput(props) {

    const [activeSendButton, setActiveSendButton] = useState(false)
    const [message, setMessage] = useState("")
    const { onSend, disabled, clicked } = props

    useEffect(() => {
        setActiveSendButton(!!message)
    }, [message])

    const handleSendButtonClicked = () => {
        if (onSend) {
            onSend(message)
            setMessage("")
        }
    }

    const handleMessageInputChange = (event) => {
        setMessage(event.target.value)
    }

    const handleMessageKeyDown = (event) => {

        if (!message) {
            return
        }

        if (event.shiftKey) {
            return
        }

        if (event.keyCode === 13) {
            handleSendButtonClicked()
            event.preventDefault()
        }

    }

    const handleMessageInputClicked = () => {
        if (clicked) {
            clicked()
        }
    }

    return (
        <FormControl variant="outlined" fullWidth={true}>
            <OutlinedInput
                disabled={disabled}
                autoFocus={true}
                fullWidth={true}
                type="text"
                multiline={true}
                value={message}
                onChange={handleMessageInputChange}
                onKeyDown={handleMessageKeyDown}
                onClick={handleMessageInputClicked}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleSendButtonClicked}
                            disabled={!activeSendButton}
                            aria-label="send message"
                            edge="end"
                        >
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                }
                placeholder="Type a message..."
            />
        </FormControl>
    )
}