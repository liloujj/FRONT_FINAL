import { createSlice } from "@reduxjs/toolkit"
import axios from "../../helpers/axios"


export function AsyncDeleteAppointment(id) {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.delete(
                `/patient/cancel-appointment/${id}`,
            )
            console.log(response)
            dispatch(cancelAppointment(id))

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
export function AsyncEditAppointment(id,date,time,status) {
    return async (dispatch) => {
        dispatch(editing())

        try {
            const response = await axios.put(
                `/patient/reschedule-appointment/${id}`,
                {
                    date,
                    time,
                    status,
                }
            )
            console.log(response)
            const appointment = response.data.data
            dispatch(editAppointment(appointment))

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

export function AsyncCreateAppointment(date,time) {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.post(
                "/patient/take-appointment",
                {
                    date,
                    time,
                }
            )
            console.log(response)
            const appointment = response.data.appointment
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

export function AsyncGetPatientAppointments() {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.get(
                "/patient/appointments",
            )
            const appointments = response.data.appointments
            console.log(appointments)
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
    editInProgress: false,
    appointments: [],
}

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        fetching(state) {
            state.fetchingInProgress = true
        },
        editing(state) {
            state.editInProgress = true
        },
        setAppointments(state, action) {
            state.appointments = action.payload
            state.fetchingInProgress = false
        },
        addAppointment(state,action){
            state.appointments =[...state.appointments,action.payload]
            state.fetchingInProgress = false
        },
        deleteAppointment(state,action){
            state.appointments =[...state.appointments.filter((appointment) => appointment._id !== action.payload)]
            state.fetchingInProgress = false
        },
        cancelAppointment(state, action) {
            state.appointments.some((appointment, index) => {
                if (appointment._id === action.payload) {
                    state.appointments[index] = { ...state.appointments[index], status:"Cancelled" }
                    return true
                }

                return false
            })
            state.editInProgress = false
        },
        
        editAppointment(state, action) {
            console.log(action.payload)
            state.appointments.some((appointment, index) => {
                if (appointment._id === action.payload._id) {
                    state.appointments[index] = { ...state.appointments[index], ...action.payload }
                    return true
                }

                return false
            })
            state.editInProgress = false
        },
        handleErrors(state, action) {
            state.errorMessage = action.payload.error
            state.fetchingInProgress = false
            state.editInProgress = false
        }
    },
})

const { fetching, setAppointments,handleErrors,addAppointment,deleteAppointment,editing,editAppointment,cancelAppointment} = appointmentSlice.actions
export const reducer = appointmentSlice.reducer