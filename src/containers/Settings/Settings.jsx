"use client"

import {
  Container,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  Alert,
  IconButton,
  FormControl,
  useTheme,
  alpha,
  Divider,
  Tooltip,
} from "@mui/material"
import * as Yup from "yup"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik"
import { editPersonalData } from "../Login/LoginSlice"
import { useTranslation } from "react-i18next"

// Icons
import LockIcon from "@mui/icons-material/Lock"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import PersonIcon from "@mui/icons-material/Person"
import SaveIcon from "@mui/icons-material/Save"
import LanguageIcon from "@mui/icons-material/Language"
import KeyIcon from "@mui/icons-material/Key"
import TranslateIcon from "@mui/icons-material/Translate"
import RefreshIcon from "@mui/icons-material/Refresh"

function handleError(schema, name) {
  if (schema.touched[name] && schema.errors[name]) {
    return schema.errors[name]
  }
  return null
}

export default function Settings() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { name } = useSelector((state) => state.login)
  const [changePasswordMessage, setChangePasswordMessage] = useState(null)
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  })

  const { t, i18n } = useTranslation()

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    })
  }

  const resetForm = () => {
    changePasswordSchema.resetForm()
    setChangePasswordMessage(null)
  }

  const changePasswordSchema = useFormik({
    initialValues: { password: "", new_password: "", confirm_new_password: "" },
    validationSchema: Yup.object({
      password: Yup.string().required(t("Required.")),
      new_password: Yup.string()
        .required(t("Required."))
        .min(8, t("Password must be at least 8 characters"))
        .matches(/[a-z]/, t("Password must contain at least one lowercase letter"))
        .matches(/[A-Z]/, t("Password must contain at least one uppercase letter"))
        .matches(/[0-9]/, t("Password must contain at least one number")),
      confirm_new_password: Yup.string()
        .required(t("Required."))
        .oneOf([Yup.ref("new_password")], t("Passwords must match")),
    }),
    onSubmit: (values) => {
      dispatch(
        editPersonalData(
          values.password,
          values.new_password,
          () => {
            // success
            setChangePasswordMessage({
              message: t("The password changed with success"),
              type: "success",
            })

            changePasswordSchema.resetForm()
            changePasswordSchema.setSubmitting(false)
          },
          (error) => {
            // error
            setChangePasswordMessage({
              message: error,
              type: "error",
            })

            changePasswordSchema.setSubmitting(false)
          },
        ),
      )
    },
  })

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
        {/* Header Section */}
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
              {t("Settings")}
            </Typography>
          </Box>

        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Password Change Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <KeyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight="600">
              {t("Change password")}
            </Typography>
          </Box>

          {changePasswordMessage && (
            <Alert
              severity={changePasswordMessage.type}
              sx={{ mb: 3, animation: "fadeIn 0.3s ease-out" }}
              onClose={() => setChangePasswordMessage(null)}
            >
              {changePasswordMessage.message}
            </Alert>
          )}

          <form onSubmit={changePasswordSchema.handleSubmit}>
            <Grid container spacing={3}>
                <Grid item size={6} container >
                <Grid item size={12}>
                    <TextField
                    name="name"
                    value={name}
                    disabled
                    size="small"
                    fullWidth
                    label={t("Name")}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PersonIcon color="disabled" />
                        </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiInputBase-root": {
                        backgroundColor: alpha(theme.palette.grey[200], 0.5),
                        },
                    }}
                    />
                </Grid>

                <Grid item size={12}>
                    <TextField
                    name="password"
                    value={changePasswordSchema.values.password}
                    onChange={changePasswordSchema.handleChange}
                    onBlur={changePasswordSchema.handleBlur}
                    size="small"
                    type={showPassword.password ? "text" : "password"}
                    error={Boolean(handleError(changePasswordSchema, "password"))}
                    helperText={handleError(changePasswordSchema, "password")}
                    fullWidth
                    label={t("Current Password")}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <LockIcon color="primary" />
                        </InputAdornment>
                        ),
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => togglePasswordVisibility("password")}
                            edge="end"
                            size="small"
                            >
                            {showPassword.password ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>
              </Grid>

              <Grid item size={6} container spacing={2}>
                <Grid item size={12}>
                  <TextField
                    name="new_password"
                    value={changePasswordSchema.values.new_password}
                    onChange={changePasswordSchema.handleChange}
                    onBlur={changePasswordSchema.handleBlur}
                    size="small"
                    type={showPassword.newPassword ? "text" : "password"}
                    error={Boolean(handleError(changePasswordSchema, "new_password"))}
                    helperText={handleError(changePasswordSchema, "new_password")}
                    fullWidth
                    label={t("New Password")}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => togglePasswordVisibility("newPassword")}
                            edge="end"
                            size="small"
                          >
                            {showPassword.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item size={12}>
                  <TextField
                    name="confirm_new_password"
                    value={changePasswordSchema.values.confirm_new_password}
                    onChange={changePasswordSchema.handleChange}
                    onBlur={changePasswordSchema.handleBlur}
                    size="small"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    error={Boolean(handleError(changePasswordSchema, "confirm_new_password"))}
                    helperText={handleError(changePasswordSchema, "confirm_new_password")}
                    fullWidth
                    label={t("Confirm New Password")}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => togglePasswordVisibility("confirmPassword")}
                            edge="end"
                            size="small"
                          >
                            {showPassword.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={changePasswordSchema.isSubmitting}
                  startIcon={<SaveIcon />}
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
                  {changePasswordSchema.isSubmitting ? t("Saving...") : t("Save Changes")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Language Section */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <TranslateIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight="600">
              {t("Change language")}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  value={i18n.language}
                  onChange={(e) => handleChangeLanguage(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <LanguageIcon color="primary" />
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
                  <MenuItem value="en">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {t("English")}
                    </Box>
                  </MenuItem>
                  <MenuItem value="fr">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {t("French")}
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}
