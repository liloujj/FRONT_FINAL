"use client"

import { useEffect, useState } from "react"
import {
  Typography,
  InputLabel,
  Box,
  Select,
  IconButton,
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
  Container,
  useTheme,
  alpha,
  Tooltip,
  Alert,
  TablePagination,
  Badge,
} from "@mui/material"
import DoneIcon from "@mui/icons-material/Done"
import CloseIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import AssignmentIcon from "@mui/icons-material/Assignment"
import RefreshIcon from "@mui/icons-material/Refresh"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import { AsyncGetUsers, AsyncActivateDoctor, AsyncRejectDoctor } from "./UserSlice"
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"

import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function User() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { users } = useSelector((state) => state.user)
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [filterValue, setFilterValue] = useState("All")

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { t } = useTranslation()

  const handleFilter = (value) => {
    setFilterValue(value)
    if (value !== "All") {
      const data = users.filter((item) => item.role === value)
      setFilteredUsers(data)
    } else {
      setFilteredUsers(users)
    }
    // Reset to first page when filtering
    setPage(0)
  }

  const handleRefresh = () => {
    dispatch(AsyncGetUsers())
  }

  const handleGoToDocument = (document_id) => {
    navigate(`/document-doctor/${document_id}`)
  }

  const handleActivateDoctor = (doctor_id) => {
    dispatch(AsyncActivateDoctor(doctor_id))
  }

  const handleRejectDoctor = (doctor_id) => {
    dispatch(AsyncRejectDoctor(doctor_id))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    dispatch(AsyncGetUsers())
  }, [dispatch])

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  // Apply pagination
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Doctor":
        return theme.palette.primary.main
      case "Patient":
        return theme.palette.info.main
      case "Admin":
        return theme.palette.warning.main
      default:
        return theme.palette.grey[500]
    }
  }

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
              {t("Users")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title={t("Refresh users")}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="user-filter-label">{t("User Type")}</InputLabel>
              <Select
                value={filterValue}
                labelId="user-filter-label"
                label={t("User Type")}
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
                <MenuItem value="All">{t("All Users")}</MenuItem>
                <MenuItem value="Patient">{t("Patients")}</MenuItem>
                <MenuItem value="Doctor">{t("Doctors")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {filteredUsers.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {filterValue === "All" ? t("No users found.") : t(`No ${filterValue.toLowerCase()} users found.`)}
          </Alert>
        ) : (
          <>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2, overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("User")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Email")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Phone")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Join Date")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Status")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {t("Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => {
                    const formattedDate = dayjs(user.createdAt).format("DD-MM-YY HH:mm")
                    const roleColor = getRoleBadgeColor(user.role)

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
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                              badgeContent={
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: roleColor,
                                    border: `2px solid ${theme.palette.background.paper}`,
                                  }}
                                />
                              }
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha(roleColor, 0.1),
                                  color: roleColor,
                                  mr: 2,
                                }}
                              >
                                <PersonIcon />
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t(user.role)}
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
                              label={user.isActive ? t("Enabled") : t("Disabled")}
                              size="small"
                              sx={{ fontWeight: "medium" }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            {user.role === "Doctor" && (
                              <>
                                <Tooltip title={user.isActive ? t("Disable doctor") : t("Enable doctor")}>
                                  <IconButton
                                    onClick={() => {
                                      user.isActive ? handleRejectDoctor(user._id) : handleActivateDoctor(user._id)
                                    }}
                                    color={user.isActive ? "error" : "success"}
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    {user.isActive ? <CloseIcon /> : <DoneIcon />}
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={t("View documents")}>
                                  <IconButton
                                    onClick={() => handleGoToDocument(user._id)}
                                    color="primary"
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <AssignmentIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
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
