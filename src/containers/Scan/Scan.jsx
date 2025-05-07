"use client"

import {
  Container,
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
  Paper,
  Avatar,
  useTheme,
  alpha,
  Divider,
  Tooltip,
  Alert,
  TablePagination,
  Button
} from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import PersonIcon from "@mui/icons-material/Person"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import RefreshIcon from "@mui/icons-material/Refresh"
import VisibilityIcon from "@mui/icons-material/Visibility"
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from "dayjs"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { AsyncGetScans } from "./ScanSlice"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../configs";


import { useTranslation } from "react-i18next"

export default function Scan() {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { scans } = useSelector((state) => state.scan)
  const { name, role, id } = useSelector((state) => state.login)

    const { isPatientPremium } = useSelector((state) => state.payment)
  
  const { t } = useTranslation()

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleGoToDocument = (document_id) => {
    navigate(`/document/${document_id}`)
  }

  const handleRefresh = () => {
    dispatch(AsyncGetScans())
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    dispatch(AsyncGetScans())
  }, [dispatch])


  const handleDownload = async (url_file,path) => {
    const file = `${url_file}${path}`
    const fileName = file.split('/').pop();
    const response = await fetch(file); // Replace with your file URL
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Specify the file name
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // Clean up
  };

  const paginatedScans = scans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Container maxWidth="lg">
    {!isPatientPremium && role === "Patient"  &&
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
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {t("Premium Feature")}
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
      }
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
              {t("Scans")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title={t("Refresh scans")}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {scans.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t("No scans found.")}
          </Alert>
        ) : (
          <>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2, overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Patient")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t("Created at")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {t("Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedScans.map((scan) => {
                    const formattedDate = dayjs(scan.createdAt).format("DD-MM-YY HH:mm")
                    return (
                      <TableRow
                        key={scan._id}
                        hover
                        sx={{
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                                mr: 2,
                              }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {role}
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
                        <TableCell align="right">
                          <Tooltip title={t("View scan")}>
                            <IconButton
                            onClick={() => handleGoToDocument(scan._id)}

                              size="small"
                              color="primary"
                              sx={{
                                transition: "transform 0.2s ease",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                              }}
                                >
                              <VisibilityIcon />
                            </IconButton>
                                <IconButton
                                    onClick={()=>{handleDownload(BASE_URL,scan.imageURL)}}
                                    size="small"
                                    color="primary"
                                    sx={{
                                    transition: "transform 0.2s ease",
                                    "&:hover": {
                                        transform: "scale(1.1)",
                                    },
                                    }}
                                >
                                    <DownloadIcon />
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
              labelRowsPerPage={t("Rows per page")}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={scans.length}
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
