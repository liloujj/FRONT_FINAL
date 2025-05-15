"use client"

import { useEffect, useState, useRef } from "react"
import {
  Typography,
  Box,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Chip,
  Avatar,
  useTheme,
  alpha,
  TablePagination,
  Button,
  Card,
  CardContent,
} from "@mui/material"
import DoneIcon from "@mui/icons-material/Done"
import CloseIcon from "@mui/icons-material/Close"
import RefreshIcon from "@mui/icons-material/Refresh"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import StarIcon from "@mui/icons-material/Star"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import { useDispatch, useSelector } from "react-redux"

import dayjs from "dayjs"

import { useTranslation } from "react-i18next"
import { AsyncgetAllDoctors } from "./PaymentSlice"
import { useNavigate } from "react-router-dom"

export default function Doctors() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const { doctors, isPatientPremium } = useSelector((state) => state.payment)
  const [filteredUsers, setFilteredUsers] = useState(doctors)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { t } = useTranslation()

  useEffect(() => {
    setLoaded(true)
  }, [])

  // Beautiful background animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)

    // Create particles for the neural network
    const particles = []
    const connections = []
    const numParticles = 120
    const connectionDistance = 150
    const particleColors = ["#4c1d95", "#5b21b6", "#7e22ce", "#8b5cf6", "#6d28d9", "#4338ca", "#ec4899", "#be185d"]

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseSize: 0,
        pulseDirection: 1,
      })
    }

    // Animation function
    function animate() {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#0f172a")
      gradient.addColorStop(0.5, "#1e1b4b")
      gradient.addColorStop(1, "#4a1d96")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particles
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1

        // Pulse effect
        particle.pulseSize += particle.pulseSpeed * particle.pulseDirection
        if (particle.pulseSize > 1 || particle.pulseSize < 0) {
          particle.pulseDirection *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius + particle.pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Find and draw connections
      connections.length = 0
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            connections.push({
              p1: particles[i],
              p2: particles[j],
              opacity: 1 - distance / connectionDistance,
            })
          }
        }
      }

      // Draw connections
      connections.forEach((connection) => {
        ctx.beginPath()
        ctx.moveTo(connection.p1.x, connection.p1.y)
        ctx.lineTo(connection.p2.x, connection.p2.y)

        // Create gradient for connection
        const gradient = ctx.createLinearGradient(connection.p1.x, connection.p1.y, connection.p2.x, connection.p2.y)
        gradient.addColorStop(0, connection.p1.color.replace(")", `, ${connection.opacity})`).replace("rgb", "rgba"))
        gradient.addColorStop(1, connection.p2.color.replace(")", `, ${connection.opacity})`).replace("rgb", "rgba"))

        ctx.strokeStyle = gradient
        ctx.lineWidth = connection.opacity * 1.5
        ctx.stroke()
      })

      // Add subtle glow effect
      const radialGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
      radialGradient.addColorStop(0, "rgba(139, 92, 246, 0.05)")
      radialGradient.addColorStop(0.5, "rgba(124, 58, 237, 0.03)")
      radialGradient.addColorStop(1, "rgba(109, 40, 217, 0)")
      ctx.fillStyle = radialGradient
      ctx.fillRect(0, 0, width, height)

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleRefresh = () => {
    if (isPatientPremium) {
      dispatch(AsyncgetAllDoctors())
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    if (isPatientPremium) {
      dispatch(AsyncgetAllDoctors())
    }
  }, [dispatch, isPatientPremium])

  useEffect(() => {
    setFilteredUsers(doctors)
  }, [doctors])

  // Apply pagination
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        pb: 6,
      }}
    >
      {/* Beautiful Neural Network Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Background Overlay with more purple tint */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, rgba(91, 33, 182, 0.2) 0%, rgba(49, 10, 101, 0.6) 100%)",
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          pt: { xs: 4, sm: 6 },
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 4, md: 6 },
          width: "100%",
        }}
      >
        {/* Page Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            mt: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              background: "linear-gradient(to right, #ffffff, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("Doctors")}
          </Typography>
          {isPatientPremium && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {t("Refresh")}
              </Button>
            </Box>
          )}
        </Box>

        {/* Main Content Card */}
        <Card
          sx={{
            borderRadius: "24px",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            mb: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.4s",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(to right, #8b5cf6, #ec4899)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {!isPatientPremium ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(236, 72, 153, 0.1)",
                    color: "#ec4899",
                    mb: 3,
                  }}
                >
                  <StarIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                  {t("Premium Feature")}
                </Typography>
                <Typography
                  variant="body1"
                  color="rgba(255, 255, 255, 0.7)"
                  paragraph
                  sx={{ maxWidth: 600, mx: "auto" }}
                >
                  {t("You need to upgrade to premium to access the complete list of doctors.")}
                </Typography>
                <Typography
                  variant="body1"
                  color="rgba(255, 255, 255, 0.7)"
                  paragraph
                  sx={{ maxWidth: 600, mx: "auto" }}
                >
                  {t(
                    "The average patient gets the scan within 24/48 hours. And the premium patient gets it immediately.",
                  )}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<StarIcon />}
                  onClick={() => {
                    navigate("/subscription")
                  }}
                  sx={{
                    mt: 2,
                    background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                    color: "white",
                    borderRadius: "12px",
                    py: 1,
                    px: 3,
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #7c3aed, #db2777)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(236, 72, 153, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {t("Upgrade to Premium")}
                </Button>
              </Box>
            ) : filteredUsers.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                  background: alpha(theme.palette.common.white, 0.02),
                  borderRadius: "8px",
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <MedicalServicesIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                <Typography color="rgba(255, 255, 255, 0.7)" variant="h6" gutterBottom>
                  {t("No doctors found in the system.")}
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer
                  sx={{
                    borderRadius: "8px",
                    background: alpha(theme.palette.common.white, 0.02),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    mb: 2,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      height: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Doctor")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Email")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Phone")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Join Date")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Status")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedUsers.map((user) => {
                        const formattedDate = dayjs(user.createdAt).format("DD-MM-YY HH:mm")

                        return (
                          <TableRow
                            key={user.id || user._id}
                            hover
                            sx={{
                              transition: "background-color 0.3s ease",
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              },
                              "& td": {
                                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                color: "white",
                                py: 2,
                              },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                  sx={{
                                    bgcolor: "rgba(139, 92, 246, 0.1)",
                                    color: "#8b5cf6",
                                    mr: 2,
                                  }}
                                >
                                  <MedicalServicesIcon />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {user.name}
                                  </Typography>
                                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                    {user.specialization || t("General Practitioner")}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <EmailIcon fontSize="small" sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }} />
                                <Typography>{user.email}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <PhoneIcon fontSize="small" sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }} />
                                <Typography>{user.p_phoneNum || user.phoneNum || t("Not provided")}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CalendarMonthIcon fontSize="small" sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }} />
                                <Typography>{formattedDate}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {user.role === "Doctor" && (
                                <Chip
                                  icon={user.isActive ? <DoneIcon /> : <CloseIcon />}
                                  label={user.isActive ? t("Available") : t("Unavailable")}
                                  size="small"
                                  sx={{
                                    fontWeight: "medium",
                                    backgroundColor: user.isActive ? alpha("#10b981", 0.2) : alpha("#ef4444", 0.2),
                                    color: user.isActive ? "#10b981" : "#ef4444",
                                    borderRadius: "8px",
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  labelRowsPerPage={t("Rows per page")}
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredUsers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                      margin: 0,
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    ".MuiTablePagination-select": {
                      color: "white",
                    },
                    ".MuiSvgIcon-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
