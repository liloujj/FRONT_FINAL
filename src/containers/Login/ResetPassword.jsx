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
import PasswordIcon from '@mui/icons-material/Password';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { AsyncResetPassword } from "./LoginSlice";

function handleError(schema, name) {

    if (schema.touched[name] && schema.errors[name]) {
        return schema.errors[name]
    }

    return null
}

export default function ResetPassword() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const navigate = useNavigate()
  const {token} = useParams() 
  const dispatch = useDispatch()

  const handleOnSuccess =()=>
  {
    navigate("/login")
  }
  const schema = useFormik({
    initialValues: { password: ''},
    validationSchema: Yup.object({
        password: Yup.string().required("Required.")
    }),
    onSubmit: (values) => {
        dispatch(AsyncResetPassword(token,values.password,handleOnSuccess))
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
              Reset your password
            </Typography>
            <Box component="form" onSubmit={schema.handleSubmit}>
              <Box sx={{ mb: 2.5 }}>
                <TextField
                    error={!!handleError(schema, "password")}
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={schema.values.id}
                    onChange={schema.handleChange}
                    onBlur={schema.handleBlur}
                    helperText={handleError(schema, "password")}
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
                  Reset
                </Box>
                <LockResetIcon size={18} />
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
