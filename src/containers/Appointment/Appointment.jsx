"use client"

import { useEffect, useState } from "react"
import {
  Typography,
  InputLabel,
  Container,
  Box,
  Select,
  IconButton,
  Fab,
  InputAdornment,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  MenuItem,
  FormControl,
  Chip,
  Divider,
  Avatar,
  Button,
  useTheme,
  alpha,
  Tooltip,
  Alert,
  TablePagination,
} from "@mui/material"

import DoneIcon from "@mui/icons-material/Done"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import PersonIcon from "@mui/icons-material/Person"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import RefreshIcon from "@mui/icons-material/Refresh"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import {
  AsyncGetAppointments,
  AsyncGetPatientAppointments,
  AsyncDeleteAppointment,
  AsyncAdminApproveAppointment,
  AsyncAdminRefuseAppointment,
} from "./AppointmentSlice"
import { AsyncGetUsers } from "../User/UserSlice"
import { useDispatch, useSelector } from "react-redux"

import AppointmentEditDialog from "./Dialogs/AppointmentEditDialog"
import dayjs from "dayjs"

import { useTranslation } from "react-i18next"

export default function Appointment() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const { role, name } = useSelector((state) => state.login)
  const { appointments } = useSelector((state) => state.appointment)
  const { users } = useSelector((state) => state.user)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [model, setModel] = useState(null)
  const [isEditDialogModeUpdate, setEditDialogModeUpdate] = useState(false)
  const [filterValue, setFilterValue] = useState("All")

  const { t } = useTranslation()

  const [filteredAppointments, setFilteredAppointments] = useState(appointments)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleFilter = (value) => {
    setFilterValue(value)
    if (value !== "All") {
      const data = appointments.filter((item) => item.status === value)
      setFilteredAppointments(data)
    } else {
      setFilteredAppointments(appointments)
    }
    // Reset to first page when filtering
    setPage(0)
  }

  const handleRefresh = () => {
    if (role === "Patient") {
      dispatch(AsyncGetPatientAppointments())
    } else {
      dispatch(AsyncGetAppointments())
    }
  }

  useEffect(() => {
    setFilteredAppointments(appointments)
  }, [appointments])

  const handleDeleteAppointment = (id) => {
    dispatch(AsyncDeleteAppointment(id))
  }

  const handleOpenUpdateDialog = () => {
    setDeleteDialogOpen(true)
    setEditDialogModeUpdate(true)
  }

  const handleOpenDialog = () => {
    setDeleteDialogOpen(true)
    setEditDialogModeUpdate(false)
  }

  const handleCloseDeleteDialog = (result) => {
    setDeleteDialogOpen(false)
  }

  const handleAdminRefuseAppointment = (id) => {
    dispatch(AsyncAdminRefuseAppointment(id))
  }

  const handleAdminApproveAppointment = (id) => {
    dispatch(AsyncAdminApproveAppointment(id))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    if (role === "Patient") {
      dispatch(AsyncGetPatientAppointments())
    } else if (role === "Admin") {
      dispatch(AsyncGetUsers())
      dispatch(AsyncGetAppointments())
    } else {
      dispatch(AsyncGetAppointments())
    }
  }, [dispatch, role])

  // Apply pagination
  const paginatedAppointments = filteredAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Get status chip color
  const getStatusChipProps = (status) => {
    switch (status) {
      case "Approved":
        return { color: "success", icon: <DoneIcon fontSize="small" /> }
      case "Pending":
        return { color: "warning", icon: <CalendarMonthIcon fontSize="small" /> }
      case "Refused":
        return { color: "error", icon: <CloseIcon fontSize="small" /> }
      case "Cancelled":
        return { color: "default", icon: <CloseIcon fontSize="small" /> }
      default:
        return { color: "primary", icon: <CalendarMonthIcon fontSize="small" /> }
    }
  }

  return (
    <Container maxWidth="lg">
      {role === "SuperAdmin" && (
        <Fab
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0,118,255,0.39)",
            },
          }}
          color="primary"
          aria-label="add"
          onClick={handleOpenDialog}
        >
          <AddIcon />
        </Fab>
      )}

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
              {t("Appointments")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title={t("Refresh appointments")}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {role === "Patient" && (
              <Button
                onClick={handleOpenDialog}
                variant="contained"
                startIcon={<AddIcon />}
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
                {t("New appointment")}
              </Button>
            )}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="appointment-filter-label">{t("Status")}</InputLabel>
              <Select
                labelId="appointment-filter-label"
                value={filterValue}
                label={t("Status")}
                onChange={(e) => handleFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterAltIcon fontSize="small" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="All">{t("All Appointments")}</MenuItem>
                <MenuItem value="Pending">{t("Pending")}</MenuItem>
                <MenuItem value="Cancelled">{t("Cancelled")}</MenuItem>
                <MenuItem value="Approved">{t("Approved")}</MenuItem>
                <MenuItem value="Refused">{t("Refused")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {filteredAppointments.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {filterValue === "All"
              ? t("You don't have any appointments yet.")
              : t(`You don't have any ${filterValue.toLowerCase()} appointments.`)}
          </Alert>
        ) : (
          <>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2, overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Patient")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Date & Time")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Status")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {t("Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAppointments.map((appointment) => {
                    const formattedDate = dayjs(appointment.date).format("DD-MM-YY HH:mm")
                    let user
                    if (role === "Admin") {
                      const users_list = users.filter((element) => element._id === appointment.patientID)
                      user = users_list.length === 1 ? users_list[0] : null
                    } else {
                      user = { name, role }
                    }

                    const { color, icon } = getStatusChipProps(appointment.status)

                    return (
                      <TableRow
                        key={appointment._id}
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
                                {user?.name || t("Unknown User")}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user?.role || ""}
                              </Typography>
                            </Box>
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
                          <Chip
                            icon={icon}
                            label={t(appointment.status)}
                            color={color}
                            size="small"
                            sx={{ fontWeight: "medium" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            {role === "Admin" && appointment.status === "Pending" && (
                              <>
                                <Tooltip title={t("Approve")}>
                                  <IconButton
                                    onClick={() => handleAdminApproveAppointment(appointment._id)}
                                    size="small"
                                    color="success"
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <DoneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={t("Refuse")}>
                                  <IconButton
                                    onClick={() => handleAdminRefuseAppointment(appointment._id)}
                                    size="small"
                                    color="error"
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {appointment.status !== "Refused" &&
                              appointment.status !== "Approved" &&
                              appointment.status !== "Cancelled" && (
                                <Tooltip title={t("Delete")}>
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteAppointment(appointment._id)
                                    }}
                                    size="small"
                                    color="error"
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {appointment.status !== "Refused" && appointment.status !== "Approved" && (
                              <Tooltip title={t("Edit")}>
                                <IconButton
                                  onClick={() => {
                                    handleOpenUpdateDialog()
                                    setModel(appointment)
                                  }}
                                  size="small"
                                  color="primary"
                                  sx={{
                                    transition: "transform 0.2s ease",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
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
              count={filteredAppointments.length}
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
      {isDeleteDialogOpen && (
        <AppointmentEditDialog
          isUpdate={isEditDialogModeUpdate}
          model={model}
          open={isDeleteDialogOpen}
          handleClose={handleCloseDeleteDialog}
        />
      )}
    </Container>
  )
}
