import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { Typography,AppBar,Box,Drawer,IconButton,List,ListItem,ListItemButton,ListItemIcon,ListItemText,Toolbar,Chip,Divider,Badge,Avatar } from '@mui/material';
import BiotechIcon from '@mui/icons-material/Biotech';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../containers/Login/LoginSlice';

import { useTranslation } from "react-i18next";

const drawerWidth = 300;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
});


function BaseLayout(props) {

    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {name,email,role} = useSelector((state) => state.login)

    const { links, onLogoutClicked, dir, otherActionButtons } = props

    const [desktopOpen, setDesktopOpen] = React.useState(true);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const {t} = useTranslation()

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDrawerDesktopToggle = () => {
        setDesktopOpen(!desktopOpen)
    }

    const handleLogout=()=>{
        dispatch(logout())
        navigate("/login")
    }

    const drawer = (
        <div>
            <Toolbar sx={{height:120}} />
            <Divider/>
            <List>
                {links.map((link, index) => {
                    return <ListItem sx={{paddingRight:5,paddingLeft:3}} button component={Link} to={link.path} key={index}>
                        <ListItemIcon>
                            {link.icon}
                        </ListItemIcon>
                        <ListItemText sx={{ textAlign: "left" }} primary={t(link.title)} />
                    </ListItem>
                })}
                <Divider/>
                <ListItemButton onClick={handleLogout} sx={{paddingRight:5,paddingLeft:3}}  >
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>
                    <ListItemText sx={{ textAlign: "left" }} primary={t("Log out")} />
                </ListItemButton>
            </List>
            
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                
                sx={{
                    bgcolor: "white", color: "text.primary",
                    ml: dir === "ltr" ? { sm: `${drawerWidth}px` } : 0,
                    mr: dir === "rtl" ? { sm: `${drawerWidth}px` } : 0,
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Toolbar>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                        <BiotechIcon color='primary' sx={{marginRight:1}}/>
                        <Typography variant="h6" component="div" fontWeight="bold">
                            DeepVision Lab
                        </Typography>
                        <Chip
                            label={role === "Admin" && "Admin" || role === "Patient" && "Patient"|| role === "Doctor" && "Doctor"}
                            size="small"
                            sx={(theme)=>({ ml: 1, bgcolor: theme.palette.grey[100], color: theme.palette.grey[700] })}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {otherActionButtons}
                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                            <Avatar sx={(theme)=>({ bgcolor: theme.palette.primary.light, width: 32, height: 32 })}>
                                <PersonIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body2" sx={{ ml: 1, mr: 0.5 }}>
                                {name}
                            </Typography>
                            <ArrowDropDownIcon fontSize="small" />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ display: "flex" }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        flexShrink: 0,
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    anchor={dir === "rtl" ? "right" : "left"}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="persistent"
                    sx={(theme) => ({
                        display: { xs: 'none', sm: desktopOpen ? 'block' : 'none' },
                        flexShrink: 0,
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        ...(desktopOpen && {
                            ...openedMixin(theme),
                            '& .MuiDrawer-paper': openedMixin(theme)
                        }),
                        ...(!desktopOpen && {
                            ...closedMixin(theme),
                            '& .MuiDrawer-paper': closedMixin(theme)
                        }),
                    })}
                    open={desktopOpen}
                    onClose={handleDrawerDesktopToggle}
                    anchor={dir === "rtl" ? "right" : "left"}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1,paddingTop:3 }}>
                <Toolbar />
                {props.children}
            </Box>
        </Box >
    );
}

export default BaseLayout