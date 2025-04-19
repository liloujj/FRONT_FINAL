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
  FormControl,
  InputLabel,
  FormHelperText,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Brain, Stethoscope, Scan, ChevronRight, FileText } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import { configLoginMode } from "./LoginSlice"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNum: "",
    address: "",
    role: "Patient",
    specialization: "",
    schedule: "",
  })
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const dispatch = useDispatch()
  const handleSwitchToSignUp = ()=>
  {
    //dispatch(configLoginMode("login")) to remove
    navigate("/login")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Signup successful!")
      } else {
        toast.error(data.message || "Signup failed")
      }
    } catch (error) {
      toast.error("Network error")
      console.error(error)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent:"center",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)",
      }}
    >
      <Toaster position="top-right" />

      {/* Right side - Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "md" }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} color="#1e293b" sx={{ mb: 3 }}>
                Create Your Account
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#14b8a6",
                        boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                      },
                    },
                  }}
                />
                <TextField
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#14b8a6",
                        boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                      },
                    },
                  }}
                />
                <TextField
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#14b8a6",
                        boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                      },
                    },
                  }}
                />
                <TextField
                  name="phoneNum"
                  placeholder="Phone Number"
                  value={formData.phoneNum}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#14b8a6",
                        boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                      },
                    },
                  }}
                />
                <TextField
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#14b8a6",
                        boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                      },
                    },
                  }}
                />

                  <FormControl fullWidth>

                    <Select
                      labelId="role-label"
                      value={formData.role}
                      onChange={handleSelectChange}
                      sx={{
                        borderRadius: 2,
                        bgcolor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#14b8a6",
                          boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                        },
                      }}
                    >
                      <MenuItem value="Patient">Patient</MenuItem>
                      <MenuItem value="Doctor">Doctor</MenuItem>
                    </Select>

                    {formData.role === "Doctor" && (
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: "1px solid #e2e8f0",
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <Stethoscope
                          size={16}
                          color="#14b8a6"
                          style={{ marginTop: "2px", marginRight: "8px", flexShrink: 0 }}
                        />
                        <FormHelperText sx={{ m: 0, color: "#64748b", fontSize: "0.75rem" }}>
                          <Typography component="span" fontWeight={500} sx={{ fontSize: "inherit" }}>
                            Note:
                          </Typography>{" "}
                          Doctor accounts are not for receiving care, but for being featured in our recommendation list
                          for premium patients.
                        </FormHelperText>
                      </Box>
                    )}
                  </FormControl>

                {formData.role === "Doctor" && (
                  <>
                    <TextField
                      name="specialization"
                      placeholder="Specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#14b8a6",
                            boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                          },
                        },
                      }}
                    />
                    <TextField
                      name="schedule"
                      placeholder="Schedule"
                      value={formData.schedule}
                      onChange={handleChange}
                      required
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#14b8a6",
                            boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)",
                          },
                        },
                      }}
                    />

                    {/* Document Upload Field */}
                    <Box
                      sx={{
                        border: "2px dashed #cbd5e1",
                        borderRadius: 2,
                        p: 3,
                        "&:hover": {
                          borderColor: "#14b8a6",
                          transition: "border-color 0.2s",
                        },
                      }}
                    >
                      <Box
                        component="label"
                        htmlFor="medical-document"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <FileText color="#94a3b8" size={32} />
                          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#334155" }}>
                            Upload Medical Credentials
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                            Upload a document proving you're a certified medical professional
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            PDF, JPG or PNG (max. 5MB)
                          </Typography>
                          <input
                            id="medical-document"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                          />
                          <Button
                            variant="outlined"
                            onClick={() => document.getElementById("medical-document")?.click()}
                            sx={{
                              px: 2,
                              py: 1,
                              bgcolor: "#ecfdf5",
                              border: "1px solid #a7f3d0",
                              borderRadius: 1.5,
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#047857",
                              textTransform: "none",
                              "&:hover": {
                                bgcolor: "#d1fae5",
                                borderColor: "#6ee7b7",
                              },
                            }}
                          >
                            Select Document
                          </Button>
                          {file && (
                            <Typography sx={{ fontSize: "0.75rem", color: "#059669", mt: 1 }}>
                              {file.name} selected
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    py: 1.5,
                    background: "linear-gradient(to right, #14b8a6, #0d9488)",
                    color: "white",
                    borderRadius: 2,
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
                  Sign Up
                  <ChevronRight size={20} style={{ marginLeft: "8px" }} />
                </Button>

                <Typography align="center" sx={{ fontSize: "0.875rem", color: "#64748b", mt: 2 }}>
                  Already have an account?{" "}
                  <Button
                    onClick={handleSwitchToSignUp}
                    sx={{
                      color: "#14b8a6",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Log in
                  </Button>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}
