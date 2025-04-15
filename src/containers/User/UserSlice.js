import { createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../configs"
import axios from "../../helpers/axios"


export function AsyncGetUsers() {
    return async (dispatch) => {
        dispatch(loading())

        try {
            const response = await axios.get(
                "/admin/users",
                {
                    baseURL: BASE_URL,
                }
            )
            const users = response.data.users
            dispatch(setUsers(users))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            } else {
                const error = "Something went wrong, Try again"
                dispatch(handleError({ error }))
            }
        }
    }
}


const initialState = {
    inProgress: false,
    errorMessage: null,
    users:[],
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loading(state) {
            state.inProgress = true
            state.errorMessage = null
        },
        setUsers(state,action){
            state.users = action.payload
            state.inProgress = false
        },
        handleError(state, action) {
            const { error } = action.payload
            state.errorMessage = error
            state.inProgress = false
        },
    },
})

const { handleError, loading,setUsers} = userSlice.actions
export const reducer = userSlice.reducer