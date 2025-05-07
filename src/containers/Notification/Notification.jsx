"use client"

import {
  Typography,
  InputLabel,
  Badge,
  Container,
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
  Button,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  Divider,
  TablePagination,
  Alert,
} from "@mui/material"

import NotificationsIcon from "@mui/icons-material/Notifications"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import MarkunreadIcon from "@mui/icons-material/Markunread"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"
import RefreshIcon from "@mui/icons-material/Refresh"
import DoneAllIcon from "@mui/icons-material/DoneAll"

import { useDispatch, useSelector } from "react-redux"
import { AsyncGetNotifications, AsyncReadNotification, AsyncReadAllNotifications } from "./NotificationSlice"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

export function Notification() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const { notifications } = useSelector((state) => state.notification)
  const unreadCount = notifications.filter((element) => element.read === false).length

  useEffect(() => {
    dispatch(AsyncGetNotifications())
  }, [dispatch])

  return (
    <Tooltip title={unreadCount > 0 ? `${unreadCount} unread notifications` : "No new notifications"}>
      <IconButton
        onClick={() => navigate("/notifications")}
        color="inherit"
        sx={{
          position: "relative",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.7rem",
              height: "20px",
              minWidth: "20px",
              padding: "0 6px",
              fontWeight: "bold",
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}

export function NotificationTable() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { role, name } = useSelector((state) => state.login)
  const { notifications } = useSelector((state) => state.notification)
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)
  const [filterValue, setFilterValue] = useState("All")
  const { t } = useTranslation()

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleFilter = (value) => {
    setFilterValue(value)
    let data = notifications

    if (value !== "All") {
      if (value === "Read") {
        data = data.filter((item) => item.read === true)
      } else if (value === "Unread") {
        data = data.filter((item) => item.read === false)
      }
      setFilteredNotifications(data)
    } else {
      setFilteredNotifications(data)
    }

    // Reset to first page when filtering
    setPage(0)
  }

  const handleReadNotification = (id) => {
    dispatch(AsyncReadNotification(id))
  }

  const handleReadAllNotifications = () => {
    dispatch(AsyncReadAllNotifications())
  }

  const handleRefresh = () => {
    dispatch(AsyncGetNotifications())
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    setFilteredNotifications(notifications)
  }, [notifications])

  useEffect(() => {
    dispatch(AsyncGetNotifications())
  }, [dispatch])

  // Apply pagination
  const paginatedNotifications = filteredNotifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const unreadCount = notifications.filter((notification) => notification.read === false).length

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
              {t("Notifications")}
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} ${t("unread")}`}
                color="error"
                size="small"
                sx={{ ml: 2, fontWeight: "bold" }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title={t("Refresh notifications")}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              disabled={unreadCount === 0}
              onClick={handleReadAllNotifications}
              variant="contained"
              startIcon={<DoneAllIcon />}
              sx={{
                borderRadius: "8px",
                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,118,255,0.39)",
                },
                "&.Mui-disabled": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: alpha(theme.palette.primary.main, 0.26),
                },
              }}
            >
              {t("Read all")}
            </Button>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="notification-filter-label">{t("Status")}</InputLabel>
              <Select
                labelId="notification-filter-label"
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
                <MenuItem value="All">{t("All Notifications")}</MenuItem>
                <MenuItem value="Read">{t("Read")}</MenuItem>
                <MenuItem value="Unread">{t("Unread")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {filteredNotifications.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {filterValue === "All"
              ? t("You don't have any notifications yet.")
              : filterValue === "Read"
                ? t("You don't have any read notifications.")
                : t("You don't have any unread notifications.")}
          </Alert>
        ) : (
          <>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2, overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Content")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Date & Time")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {t("Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedNotifications.map((notification) => {
                    const date = dayjs(notification.createdAt).format("DD-MM-YY HH:mm")
                    return (
                      <TableRow
                        key={notification._id}
                        hover
                        sx={{
                          backgroundColor: notification.read ? "inherit" : alpha(theme.palette.primary.light, 0.05),
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: notification.read ? "normal" : "medium",
                            position: "relative",
                            pl: notification.read ? 2 : 4,
                            "&::before": !notification.read
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  left: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: theme.palette.primary.main,
                                }
                              : {},
                          }}
                        >
                          {notification.content}
                        </TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell align="right">
                          <Tooltip title={notification.read ? t("Mark as unread") : t("Mark as read")}>
                            <IconButton
                              onClick={() => handleReadNotification(notification._id)}
                              size="small"
                              color={notification.read ? "default" : "primary"}
                              sx={{
                                transition: "transform 0.2s ease",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              {notification.read ? <MarkEmailReadIcon /> : <MarkunreadIcon />}
                            </IconButton>
                          </Tooltip>
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
              count={filteredNotifications.length}
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
