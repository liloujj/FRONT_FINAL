import React from "react"
import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material"
import {
  Email,
  LocationOn,
  Phone,
  Cake,

} from "@mui/icons-material"
import { BASE_URL } from "../../configs"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next";

import dayjs from "dayjs"

export default function Profile() 
{

    const {t} = useTranslation()

    const avatarUrl = "/placeholder.svg?height=150&width=150"

    const  {role,name,email,phoneNum,avatar,address,createdAt} = useSelector((state)=>state.login)

    return (
        <Container  sx={{ mt: 4, mb: 4 }}>
        <Paper
            elevation={3}
            sx={{
            position: "relative",
            mb: 4,
            borderRadius: 2,
            overflow: "hidden",
            }}
        >
            <Box sx={{ p: 3, pb: 4, position: "relative" }}>
            <Avatar
                src={avatarUrl}
                sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                position: "absolute",
                left: 24,
                }}
            />

            <Box sx={{ ml: { xs: 0, sm: 16 }, mt: { xs: 8, sm: 0 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                <Box sx={{ml:2}}>
                    <Typography variant="h4" textAlign="left" component="h1" fontWeight="bold">
                        {name}
                    </Typography>
                    <Typography variant="h6"  textAlign="left" color="text.secondary" gutterBottom>
                        {role}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {address}
                        </Typography>
                    </Box>
                </Box>
                </Box>
            </Box>
            </Box>
        </Paper>

        <Grid container spacing={4}>
            <Grid item size={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t("About")}
                </Typography>
                <List disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <Email color="action" sx={{ mr: 2 }} />
                    <Typography variant="body2">{email}</Typography>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <Phone color="action" sx={{ mr: 2 }} />
                    <Typography variant="body2">{phoneNum}</Typography>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <Cake color="action" sx={{ mr: 2 }} />
                    <Typography variant="body2">{t("Member since ")}{dayjs(createdAt).format("DD-MM-YYYY")}</Typography>
                </ListItem>
                </List>
            </Paper>
            </Grid>
        </Grid>
        </Container>
  )
}
