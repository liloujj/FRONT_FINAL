"use client"

import { useEffect, useState } from "react"
import {
  Typography,
  Box,
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Chip,
  Avatar,
  Container,
  useTheme,
  alpha,
  Divider,
  Tooltip,
  Alert,
  TablePagination,
  Button,
} from "@mui/material"
import DoneIcon from "@mui/icons-material/Done"
import CloseIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"
import RefreshIcon from "@mui/icons-material/Refresh"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import StarIcon from "@mui/icons-material/Star"
import { useDispatch, useSelector } from "react-redux"

import dayjs from "dayjs"

import { useTranslation } from "react-i18next"
import { AsyncgetAllDoctors } from "./PaymentSlice"
import { useNavigate } from "react-router-dom"

export default function Doctors() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { doctors, isPatientPremium } = useSelector((state) => state.payment)
  const [filteredUsers, setFilteredUsers] = useState(doctors)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { t } = useTranslation()

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
              {t("Doctors")}
            </Typography>
          </Box>
          {isPatientPremium && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Tooltip title={t("Refresh doctor list")}>
                <IconButton onClick={handleRefresh} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

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
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                maxWidth: 500,
                backgroundColor: alpha(theme.palette.warning.light, 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <StarIcon
                sx={{
                  fontSize: 60,
                  color: theme.palette.warning.main,
                  mb: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {t("Premium Feature")}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {t("You need to upgrade to premium to access the complete list of doctors.")}
              </Typography>
              <Button
                variant="contained"
                color="warning"
                startIcon={<StarIcon />}
                onClick={()=>{navigate("/subscription")}}
                sx={{
                  mt: 2,
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px 0 rgba(255,152,0,0.39)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(255,152,0,0.39)",
                  },
                }}
              >
                {t("Upgrade to Premium")}
              </Button>
            </Paper>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t("No doctors found.")}
          </Alert>
        ) : (
          <>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2, overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Doctor")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Email")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Phone")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Join Date")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Status")}</TableCell>
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
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                mr: 2,
                              }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.specialization || t("General Practitioner")}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmailIcon
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main, mr: 1, opacity: 0.7 }}
                            />
                            {user.email}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PhoneIcon
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main, mr: 1, opacity: 0.7 }}
                            />
                            {user.p_phoneNum || user.phoneNum || t("Not provided")}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarMonthIcon
                              fontSize="small"
                              sx={{ color: theme.palette.primary.main, mr: 1, opacity: 0.7 }}
                            />
                            {formattedDate}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {user.role === "Doctor" && (
                            <Chip
                              icon={user.isActive ? <DoneIcon /> : <CloseIcon />}
                              color={user.isActive ? "success" : "error"}
                              label={user.isActive ? t("Available") : t("Unavailable")}
                              size="small"
                              sx={{ fontWeight: "medium" }}
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
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                  margin: 0,
                },
              }}
            />
          </>
        )}
      </Paper>
    </Container>
  )
}

