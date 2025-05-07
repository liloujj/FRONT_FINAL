"use client"

import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
  Divider,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import NotificationsIcon from "@mui/icons-material/Notifications"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { AsyncGetAppointments } from "../Appointment/AppointmentSlice"
import { AsyncGetUsers } from "../User/UserSlice"
import { AsyncGetNotifications } from "../Notification/NotificationSlice"
import ScanUploadDialog from "./Dialogs/ScanUploadDialog"
import { useTranslation } from "react-i18next"

export default function Dashboard() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const { users } = useSelector((state) => state.user)
  const { notifications } = useSelector((state) => state.notification)
  const { appointments } = useSelector((state) => state.appointment)

  const [scanDialogOpen, setScanDialogOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(AsyncGetAppointments())
    dispatch(AsyncGetUsers())
    dispatch(AsyncGetNotifications())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(AsyncGetAppointments())
    dispatch(AsyncGetUsers())
    dispatch(AsyncGetNotifications())
  }

  // Card styles with gradients
  const cardStyles = [
    {
      icon: <PersonIcon />,
      title: t("Users"),
      count: users.length,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
      iconBg: theme.palette.primary.main,
    },
    {
      icon: <NotificationsIcon />,
      title: t("Notifications"),
      count: notifications.length,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.8)} 0%, ${alpha(theme.palette.warning.dark, 0.9)} 100%)`,
      iconBg: theme.palette.warning.main,
    },
    {
      icon: <CalendarMonthIcon />,
      title: t("Appointments"),
      count: appointments.length,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.8)} 0%, ${alpha(theme.palette.success.dark, 0.9)} 100%)`,
      iconBg: theme.palette.success.main,
    },
  ]

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="700"
              color="primary.main"
              sx={{
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: "40%",
                  height: "4px",
                  bottom: "-8px",
                  left: 0,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "2px",
                },
              }}
            >
              {t("Dashboard")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title={t("Refresh data")}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              onClick={() => setScanDialogOpen(true)}
              variant="contained"
              startIcon={<UploadFileIcon />}
              sx={{
                borderRadius: "8px",
                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,118,255,0.39)",
                },
              }}
            >
              {t("Upload scan")}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {cardStyles.map((card, index) => (
            <Grid item  size={4}  key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                  },
                  // Add CSS animation for initial load instead of Framer Motion
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeIn": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    background: card.gradient,
                    p: 2,
                    color: "white",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight="600">
                      {card.title}
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: "white",
                        color: card.iconBg,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {card.icon}
                    </Avatar>
                  </Box>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h3" fontWeight="700" align="center">
                    {card.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {t("Total")} {card.title.toLowerCase()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <ScanUploadDialog
        list={users.filter((user) => user.role === "Patient")}
        open={scanDialogOpen}
        handleClose={() => setScanDialogOpen(false)}
      />
    </Container>
  )
}
