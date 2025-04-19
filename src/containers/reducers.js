import { reducer as AppointmentReducer } from "./Appointment/AppointmentSlice"
import { reducer as UserReducer} from "./User/UserSlice"
import {reducer as LoginReducer} from "./Login/LoginSlice"
import {reducer as NotificationReducer} from "./Notification/NotificationSlice"

export const reducers = {
    appointment: AppointmentReducer,
    login:LoginReducer,
    user:UserReducer,
    notification:NotificationReducer
}