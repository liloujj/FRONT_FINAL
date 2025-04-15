import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Appointment from "./Appointment/Appointment"

import GroupIcon from '@mui/icons-material/Group';
import User from './User/User';

import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './Settings/Settings';

export const routes = [
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
    },
    {
        path: "/settings",
        title: "Settings",
        icon: <SettingsIcon />,
        component: <Settings />,
        role : "Any",
    },
]
