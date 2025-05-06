import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Paper,
  Select,
  MenuItem,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Mail, Lock, ChevronRight } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from "./LoginSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { configLoginMode } from "./LoginSlice";

import { useTranslation } from "react-i18next";

function handleError(schema, name) {

    if (schema.touched[name] && schema.errors[name]) {
        return schema.errors[name]
    }

    return null
}

export default function Login() {
  const theme = useTheme()
  const navigate = useNavigate();

  const {t,i18n } = useTranslation()

  const handleChangeLanguage = (lng) => {
      i18n.changeLanguage(lng);
  };

  const dispatch = useDispatch()

  const handleSwitchToSignUp = ()=>
  {
    //dispatch(configLoginMode("signup")) to remove
    navigate("/signup")
  }

  const schema = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
        email: Yup.string().required(t("Required.")),
        password: Yup.string().required(t("Required."))
    }),
    onSubmit: (values) => {
        dispatch(login(values.email, values.password))
    }
    })


  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
        justifyContent:"center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      {/* Form Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          width:{md: "50%"},
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} color="#1e293b" sx={{ mb: 3 }}>
              {t("Log in to your account")}
            </Typography>

            <Box component="form" onSubmit={schema.handleSubmit}>
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  error={!!handleError(schema, "id")}
                  helperText={handleError(schema, "id")}
                  id="email"
                  type="email"
                  placeholder={t("your@email.com")}
                  value={schema.values.id}
                  onChange={schema.handleChange}
                  onBlur={schema.handleBlur}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 1,
                      "&:focus-within": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#14b8a6",
                          boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e2e8f0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#14b8a6",
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  error={!!handleError(schema, "password")}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={schema.values.password}
                  onChange={schema.handleChange}
                  onBlur={schema.handleBlur}
                  required
                  fullWidth
                  helperText={handleError(schema, "password")}

                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 1,
                      "&:focus-within": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#14b8a6",
                          boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e2e8f0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#14b8a6",
                      },
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  background: "linear-gradient(to right, #14b8a6, #0d9488)",
                  color: "white",
                  borderRadius: 1,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(to right, #0d9488, #0f766e)",
                  },
                }}
              >
                <Box component="span" sx={{ mr: 1 }}>
                  {t("Log in")}
                </Box>
                <ChevronRight size={18} />
              </Button>
              <Typography
                align="center"
                sx={{
                  mt:2,
                  fontSize: "0.875rem",
                  color: "#64748b",
                }}>
                {t("Did you forget your password?")}
                <Button
                  onClick={()=>{navigate("/forget-password")}}
                  variant="text"
                  sx={{
                    color: "#14b8a6",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("Forgot password")}
                </Button>
              </Typography>
              <Typography
                align="center"
                sx={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                }}
              >
                {t("Don't have an account?")}
                <Button
                  variant="text"
                  onClick={()=>handleSwitchToSignUp()}
                  sx={{
                    color: "#14b8a6",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("Sign up")}
                </Button>
              </Typography>
              <Select
                  variant="standard"
                  onChange={(e)=>handleChangeLanguage(e.target.value)}
                  labelId="language-filter-label"
                  defaultValue={i18n.language}
                  label={t("Language")}
                  >
                  <MenuItem value="en">{t("English")}</MenuItem>
                  <MenuItem value="fr">{t("French")}</MenuItem>

              </Select>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
