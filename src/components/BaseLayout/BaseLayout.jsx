import PersonIcon from "@mui/icons-material/Person"
import LogoutIcon from "@mui/icons-material/Logout"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import BiotechIcon from "@mui/icons-material/Biotech"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import NotificationsIcon from "@mui/icons-material/Notifications"

import {
  Typography,
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Chip,
  Divider,
  Badge,
  Avatar,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  useMediaQuery,
  Container,
  Tooltip,
} from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../../containers/Login/LoginSlice"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { AsyncIsPatientPremium } from "../../containers/Payment/PaymentSlice"

function BaseLayout(props) {
  const { window, links, onLogoutClicked, dir, otherActionButtons, children } = props
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { name, email, role } = useSelector((state) => state.login)

  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false)

  // State for user menu
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const isUserMenuOpen = Boolean(userMenuAnchorEl)

  // State for active tab
  const [activeTab, setActiveTab] = useState(0)

  // Find the active tab index based on current path
  useEffect(() => {
    const currentPath = location.pathname
    const activeIndex = links.findIndex((link) => link.path === currentPath)
    if (activeIndex !== -1) {
      setActiveTab(activeIndex)
    }
  }, [location.pathname, links])

  useEffect(() => {
    if (role === "Patient") {
      dispatch(AsyncIsPatientPremium())
    }
  }, [dispatch, role])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const handleLogout = () => {
    handleUserMenuClose()
    dispatch(logout())
    navigate("/login")
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    navigate(links[newValue].path)
  }

  const handleProfileClick = () => {
    handleUserMenuClose()
    navigate("/profile")
  }

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BiotechIcon  sx={{ mr: 1 ,backgroundColor:"white"}} />
          <Typography variant="h6" fontWeight="bold">
            DeepVision Lab
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            mb: 2,
            backgroundColor: alpha(theme.palette.primary.light, 0.1),
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography sx={{color:"white"}} variant="subtitle1" fontWeight="medium">
              {name}
            </Typography>
            <Chip label={role} size="small" sx={{ fontSize: "0.7rem", height: 24 }} />
          </Box>
        </Box>
      </Box>

      <List>
        {links.map((link, index) => (
          <ListItem
            key={index}
            disablePadding
            component={Link}
            to={link.path}
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: location.pathname === link.path ? alpha(theme.palette.primary.main, 0.1) : "transparent",
              color: location.pathname === link.path ? theme.palette.primary.main : "inherit",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{
                  color: location.pathname === link.path ? theme.palette.primary.main : "inherit",
                }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={t(link.title)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 2, mb: 2 }} />

      <ListItem disablePadding onClick={handleLogout}>
        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("Log out")} />
        </ListItemButton>
      </ListItem>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          color: "text.primary",
          borderBottom: `1px solid ${alpha(theme.palette.grey[300], 0.7)}`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <BiotechIcon htmlColor="white"  sx={{ mr: 1 }} />
            <Typography sx={{color:"white"}} variant="h6" component="div" fontWeight="bold">
              DeepVision Lab
            </Typography>
            <Chip
              label={role}
              size="small"
              sx={{
                ml: 1,
                bgcolor: theme.palette.grey[100],
                color: theme.palette.grey[700],
                fontWeight: "medium",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {otherActionButtons}

            <Box
              onClick={handleUserMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                py: 0.5,
                px: 1,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: alpha(theme.palette.grey[200], 0.5),
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  width: 32,
                  height: 32,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <PersonIcon fontSize="small" />
              </Avatar>
              <Typography variant="body2" sx={{ ml: 1, mr: 0.5, fontWeight: "bold" ,color:"white"}}>
                {name}
              </Typography>
              <ArrowDropDownIcon fontSize="small" />
            </Box>

            <Menu
              anchorEl={userMenuAnchorEl}
              open={isUserMenuOpen}
              onClose={handleUserMenuClose}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">{t("Profile")}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">{t("Log out")}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "280px",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Horizontal Tabs Navigation */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          position: "fixed",
          top: 64, // AppBar height
          zIndex: theme.zIndex.appBar - 1,
          display: { xs: "none", md: "block" },
        }}
      >
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                  opacity: 1,
                },
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                },
              },
            }}
          >
            {links.map((link, index) => (
              <Tab
                key={index}
                icon={link.icon}
                label={t(link.title)}
                iconPosition="start"
                sx={{
                  minWidth: 120,
                  "& .MuiSvgIcon-root": {
                    mr: 1,
                    fontSize: "1.2rem",
                  },
                }}
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 2, md: 14 }, // Extra padding for tabs on desktop
          pb: 4,
          px: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default BaseLayout
