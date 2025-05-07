"use client"
import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
  useTheme,
  alpha,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Email, LocationOn, Phone, Cake, Edit, ContentCopy } from "@mui/icons-material"
import GradeIcon from "@mui/icons-material/Grade"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

export default function Profile() {
  const { t } = useTranslation()
  const theme = useTheme()

  const avatarUrl = "/placeholder.svg?height=150&width=150"

  const { role, name, email, phoneNum, avatar, address, createdAt, specialization, schedule } = useSelector(
    (state) => state.login,
  )

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          mb: 4,
          borderRadius: 3,
          overflow: "hidden",
          backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(
            theme.palette.primary.main,
            0.3,
          )} 100%)`,
        }}
      >
        <Box
          sx={{
            height: "120px",
            width: "100%",
            backgroundColor: alpha(theme.palette.primary.main, 0.8),
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />

        <Box sx={{ p: 3, pb: 4, position: "relative", zIndex: 1, pt: { xs: 16, sm: 3 } }}>
          <Avatar
            src={avatarUrl}
            sx={{
              width: { xs: 100, sm: 140 },
              height: { xs: 100, sm: 140 },
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              position: { xs: "absolute", sm: "absolute" },
              top: { xs: "-50px", sm: "40px" },
              left: { xs: "calc(50% - 50px)", sm: "40px" },
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />

          <Box
            sx={{
              ml: { xs: 0, sm: 22 },
              mt: { xs: 0, sm: 0 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "center", sm: "space-between" },
              alignItems: { xs: "center", sm: "flex-start" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                color="white"
                sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
              >
                {name}
              </Typography>
              <Chip
                label={role}
                color="primary"
                sx={{
                  mt: 1,
                  mb: 2,
                  fontWeight: "medium",
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  color: theme.palette.primary.main,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, color: "white",mt:2 }}>
                <LocationOn  color="primary" fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5, color: "black" }}>
                  {address}
                </Typography>
              </Box>
            </Box>

          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              height: "100%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              },
              // Add CSS animation for initial load
              animation: "fadeIn 0.5s ease-out both",
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
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {t("Contact Information")}
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              <List>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <Email color="primary" sx={{ mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                      {t("Email")}
                    </Typography>
                    <Typography variant="body1">{email}</Typography>
                  </Box>
                  <Tooltip title={t("Copy Email")}>
                    <IconButton size="small" onClick={() => copyToClipboard(email)}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>

                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <Phone color="primary" sx={{ mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                      {t("Phone")}
                    </Typography>
                    <Typography variant="body1">{phoneNum}</Typography>
                  </Box>
                  <Tooltip title={t("Copy Phone")}>
                    <IconButton size="small" onClick={() => copyToClipboard(phoneNum)}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>

                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <Cake color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                      {t("Member since")}
                    </Typography>
                    <Typography variant="body1">{dayjs(createdAt).format("DD-MM-YYYY")}</Typography>
                  </Box>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {(specialization || schedule) && (
          <Grid item xs={12} md={6}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                height: "100%",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                },
                // Add CSS animation for initial load with delay
                animation: "fadeIn 0.5s ease-out 0.1s both",
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
                  p: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {t("Professional Details")}
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <List>
                  {specialization && (
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        borderBottom:
                          specialization && schedule ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : "none",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        },
                      }}
                    >
                      <GradeIcon color="primary" sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                          {t("Specialization")}
                        </Typography>
                        <Typography variant="body1">{specialization}</Typography>
                      </Box>
                    </ListItem>
                  )}

                  {schedule && (
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        },
                      }}
                    >
                      <AccessTimeIcon color="primary" sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                          {t("Schedule")}
                        </Typography>
                        <Typography variant="body1">{schedule}</Typography>
                      </Box>
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}
