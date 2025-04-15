import { createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../configs"
import axios from "../../helpers/axios"


export function login(email, password) {
    return async (dispatch) => {
        dispatch(loading())

        try {
            const response = await axios.post(
                "/user/login",
                {
                    email,
                    password,
                },
                {
                    baseURL: BASE_URL,
                }
            )
            console.log(response.data)
            const { token} = response.data.token
            dispatch(setPersonalData(response.data.user))

            sessionStorage.setItem("token", token)
            //sessionStorage.setItem("userId", user_id)

            dispatch(logged())

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

export function configLoginMode(mode){
    return (dispatch)=>{
        if (mode==="login" || mode === "signup"){
            if (mode==="login")
            {
                dispatch(setLoginMode())

            }else{
                dispatch(setSignUpMode())
            }
        }
    }
}

export function logout() {
    return (dispatch) => {
        sessionStorage.clear()
        dispatch(out())
    }
}

const initialState = {
    mode:"login",
    inProgress: false,
    isAuthenticated: false,
    errorMessage: null,
    name:null,
    email:null,
    role:null,
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        loading(state) {
            state.inProgress = true
            state.errorMessage = null
        },
        logged(state) {
            state.isAuthenticated = true
            state.inProgress = false
            state.errorMessage = null
        },
        setLoginMode(state){
            state.mode = "login"
        },
        setSignUpMode(state){
            state.mode = "signup"
        },
        setPersonalData(state,action){
            state.name = action.payload.name
            state.email = action.payload.email
            state.role = action.payload.role
        },
        out(state) {
            state.isAuthenticated = false
        },
        handleError(state, action) {
            const { error } = action.payload
            state.errorMessage = error
            state.inProgress = false
        },
    },
})

const { handleError, loading, logged, out,setPersonalData,setSignUpMode,setLoginMode } = loginSlice.actions
export const reducer = loginSlice.reducer