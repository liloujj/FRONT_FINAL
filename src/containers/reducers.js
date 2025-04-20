import { reducer as AppointmentReducer } from "./Appointment/AppointmentSlice"
import { reducer as UserReducer} from "./User/UserSlice"
import {reducer as LoginReducer} from "./Login/LoginSlice"
import {reducer as NotificationReducer} from "./Notification/NotificationSlice"
import {reducer as ScanReducer} from "./Scan/ScanSlice"

export const reducers = {
    appointment: AppointmentReducer,
    login:LoginReducer,
    user:UserReducer,
    notification:NotificationReducer,
    scan:ScanReducer,
}