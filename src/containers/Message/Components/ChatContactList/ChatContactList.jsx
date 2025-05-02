import SearchIcon from "@mui/icons-material/Search"
import { Avatar, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, ListItem, ListItemAvatar, ListItemText, OutlinedInput } from "@mui/material"
import { useEffect, useState } from "react"

export default function ChatContactList(props) {

    const { open, onClose, users } = props

    const [searchText, setSearchText] = useState("")
    const [elements, setElements] = useState([])

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value)
    }

    const handleSearchInputKeyUp = (event) => {
        const value = event.target.value
        if (!!value) {
            const newElements = users.filter((user) => {
                const fullName = `${user.first_name?.toLowerCase()} ${user.last_name?.toLowerCase()}`
                return fullName?.search(value) !== -1
            })
            setElements(newElements)
        } else {
            setElements(users)
        }

    }

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
    }

    const handleSelectedUser = (user) => () => {
        if (onClose) {
            onClose(user)
        }
    }

    useEffect(() => {
        setElements(users)
    }, [users])


    return <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth="xs" sx={{ height: "75vh" }}>
        <DialogTitle>
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
        </DialogTitle>
        <DialogContent>
            {elements.map((user) => {
                return <ListItem key={user.id} button onClick={handleSelectedUser(user)}>
                    <ListItemAvatar>
                        {
                            user?.avatar_url ?
                                <Avatar src={user.avatar_url} /> :
                                <Avatar>{user.first_name[0]}{user.last_name[0]}</Avatar>
                        }
                    </ListItemAvatar>
                    <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                </ListItem>
            })}
        </DialogContent>
    </Dialog>
}