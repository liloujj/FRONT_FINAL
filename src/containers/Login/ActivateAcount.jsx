import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import PasswordIcon from '@mui/icons-material/Password';
import { ChevronRight } from "lucide-react"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from 'react-router-dom';
import { AsyncActivateUser } from "./LoginSlice";

import { useTranslation } from "react-i18next";


function handleError(schema, name) {

    if (schema.touched[name] && schema.errors[name]) {
        return schema.errors[name]
    }

    return null
}

export default function ActivateAcount() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const {t} = useTranslation()
  
  const {token} = useParams() 

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleGoLogin = () =>
  {
    navigate("/login");
  }

  const schema = useFormik({
    initialValues: { code: ''},
    validationSchema: Yup.object({
        code: Yup.number().required(t("Required."))

    }),
    onSubmit: (values) => {
      dispatch(AsyncActivateUser(token,values.code,handleGoLogin))
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
              {t("Activate your account")}
            </Typography>
            <Box component="form" onSubmit={schema.handleSubmit}>
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  error={!!handleError(schema, "code")}
                  id="code"
                  type="code"
                  placeholder={t("code")}
                  value={schema.values.code}
                  onChange={schema.handleChange}
                  onBlur={schema.handleBlur}
                  helperText={handleError(schema, "code")}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon size={18} color="#94a3b8" />
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
                  {t("Activate")}
                </Box>
                <ChevronRight size={18} />
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
