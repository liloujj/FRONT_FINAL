import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Appointment from "./Appointment/Appointment"

import GroupIcon from '@mui/icons-material/Group';
import User from './User/User';

import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './Settings/Settings';

import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationTable } from './Notification/Notification';

import DashboardIcon from '@mui/icons-material/Dashboard';
import Dashboard from './Dashboard/Dashboard';

import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import Scan from './Scan/Scan';

export const routes = [
    {
        path: "/dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
        component: <Dashboard />,
        role : "Admin",
    },
    {
        path: "/apointments",
        title: "Apointments",
        icon: <EditCalendarIcon />,
        component: <Appointment />,
        role : "Any",
    },{
        path: "/users",
        title: "User Management",
        icon: <GroupIcon />,
        component: <User />,
        role : "Admin",
    }
    ,{
        path: "/scans",
        title: "Scans",
        icon: <DocumentScannerIcon />,
        component: <Scan />,
        role : "Patient",
    },,{
        path: "/notifications",
        title: "Notifications",
        icon: <NotificationsIcon />,
        component: <NotificationTable />,
        role : "Any",
    },
    {
        path: "/settings",
        title: "Settings",
        icon: <SettingsIcon />,
        component: <Settings />,
        role : "Any",
    },
]
