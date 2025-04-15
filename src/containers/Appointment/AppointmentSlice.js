import { createSlice } from "@reduxjs/toolkit"
import axios from "../../helpers/axios"



export function AsyncCreateAppointment(date,time,patient_id) {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.post(
                "/patient/take-appointment",
                {

                }
            )
            const appointment = response.data.appointments
            dispatch(addAppointment(appointment))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleErrors({ error }))
            } else {
                const error = "Something went wrong, Try again"
                dispatch(handleErrors({ error }))
            }
        }
    }
}

export function AsyncGetAppointments() {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.get(
                "/admin/appointments",
            )
            const appointments = response.data.appointments
            dispatch(setAppointments(appointments))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleErrors({ error }))
            } else {
                const error = "Something went wrong, Try again"
                dispatch(handleErrors({ error }))
            }
        }
    }
}

const initialState = {
    errorMessage: null,
    fetchingInProgress: false,
    appointments: [],
}

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        fetching(state) {
            state.fetchingInProgress = true
        },
        setAppointments(state, action) {
            state.appointments = action.payload
            state.fetchingInProgress = false
        },
        addAppointment(state,action){
            state.appointments =[...state.appointments,action.payload]
            state.fetchingInProgress = false
        }
        ,
        handleErrors(state, action) {
            state.errorMessage = action.payload.error
            state.fetchingInProgress = false
        }
    },
})

const { fetching, setAppointments,handleErrors,addAppointment} = appointmentSlice.actions
export const reducer = appointmentSlice.reducer