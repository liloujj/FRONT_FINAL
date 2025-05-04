import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { ChevronRight,Mail } from "lucide-react"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { AsyncInitResetPassword } from "./LoginSlice";


import { useTranslation } from "react-i18next";


function handleError(schema, name) {

    if (schema.touched[name] && schema.errors[name]) {
        return schema.errors[name]
    }

    return null
}

export default function ForgetPassword() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleOnSuccess =(token)=>
  {
    navigate(`/reset-passwrod/${token}`)
  }
  const schema = useFormik({
    initialValues: { email: ''},
    validationSchema: Yup.object({
        email: Yup.string().required("Required.")
    }),
    onSubmit: (values) => {
      dispatch(AsyncInitResetPassword(values.email,handleOnSuccess))
    }
    })
  const { t } = useTranslation()

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
              {t("Set your email")}  
            </Typography>
            <Box component="form" onSubmit={schema.handleSubmit}>
              <Box sx={{ mb: 2.5 }}>
                <TextField
                    error={!!handleError(schema, "email")}
                    id="email"
                    type="email"
                    placeholder={t("your@email.com")}
                    value={schema.values.email}
                    onChange={schema.handleChange}
                    onBlur={schema.handleBlur}
                    helperText={handleError(schema, "email")}
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
                  {t("Send")}
                </Box>
                <ChevronRight size={18} />
              </Button>
            <Typography
                align="left"
                sx={{
                  mt:2,
                  fontSize: "0.875rem",
                  color: "#64748b",
                }}>
                  {t("Go back to")} 
                <Button
                  onClick={()=>{navigate("/login")}}
                  variant="text"
                  sx={{
                    color: "#14b8a6",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("Log in")}
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
