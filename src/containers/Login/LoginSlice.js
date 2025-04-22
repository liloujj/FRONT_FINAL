import { createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../configs"
import axios from "../../helpers/axios"
import toast from "react-hot-toast"

export function AsyncResetPassword(token,newPassword,action) {
    return async (dispatch) => {
        dispatch(loading())
        try {
            const response = await axios.put(
                "/user/pass_reset",
                {
                    newPassword,
                    token,
                },
            )
            if (response && response.status ===200)
            {
                toast(response.data.message)
                action()
            }
            dispatch(endFetching())

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            }
            else {
                const error = "Something went wrong, Try again"
                toast(error)
                dispatch(handleError({ error }))
            }
        }
    }
}

export function AsyncInitResetPassword(email,action) {
    return async (dispatch) => {
        dispatch(loading())
        try {
            const response = await axios.put(
                "/user/pass_recovery",
                {
                    email,
                },
            )
            if (response && response.status ===200)
            {
                const token = response.data.token
                action(token)
            }
            dispatch(endFetching())

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            }

            else if (response && response.status === 404)
            {
                const error = response.data.error
                toast("There is no user with this email")
                dispatch(handleError({ error }))

            }
            else {
                const error = "Something went wrong, Try again"
                toast(error)
                dispatch(handleError({ error }))
            }
        }
    }
}

export function editPersonalData(name,password) {
    return async (dispatch) => {
        dispatch(loading())
        try {
            const response = await axios.put(
                "/user/informations",
                {
                    name,
                    password,
                },
                {
                    baseURL: BASE_URL,
                }
            )
            dispatch(setPersonalData(response.data.user))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            }
            else {
                const error = "Something went wrong, Try again"
                dispatch(handleError({ error }))
            }
        }
    }
}

export function AsyncActivateUser(token,activationCode,action)
{
    return async(dispatch) =>{
        dispatch(loading())
        try {
            const response = await axios.post(
                "/user/activate-account",
                {
                    activationCode,
                    token
                }
            )
            action()
            toast("Account has been created")

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            }if(response && response.status === 500){
                if (response.data.error)
                {
                    toast(response.data.error)
                }
            }
            else {
                const error = "Something went wrong, Try again"
                dispatch(handleError({ error }))
            }
        }
    }
}

export function AsyncSignUp(name, email, password, phoneNum, address, role ,action)
{
    return async(dispatch) =>
    {
        dispatch(loading())
        try {
            const response = await axios.post(
                "/user/signup",
                {
                    name,
                    email,password,phoneNum,address,role
                }
            )
            const { token} = response.data.token
            toast("Check your email")
            action(token)
            //sessionStorage.setItem("userId", user_id)

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            }else if(response && response.status === 500)
            {
                const error = response.data.error
                dispatch(handleError({ error }))
                toast("User already exist") 
            }
            else {
                const error = "Something went wrong, Try again"
                dispatch(handleError({ error }))
                toast(error) 

            }
        }
    }
}

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
            const { token} = response.data.token
            toast("Logged")
            dispatch(setPersonalData(response.data.user))

            sessionStorage.setItem("token", token)
            //sessionStorage.setItem("userId", user_id)

            dispatch(logged())

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            }else if(response && response.status === 401)
                {
                    toast("Email or password are incorrect, try again")  
                }
            else {
                const error = "Something went wrong, Try again"
                dispatch(handleError({ error }))
                toast(error)  
            }
        }
    }
}


export function logout() {
    return async (dispatch) => {
        dispatch(loading())

        try {
            const response = await axios.post(
                "/user/logout",
            )
            sessionStorage.clear()
            dispatch(removePersonalData())
            dispatch(out())
            toast("Logged out")

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


const initialState = {
    mode:"login",
    inProgress: false,
    isAuthenticated: false,
    errorMessage: null,
    name:null,
    email:null,
    role:null,
    id:null,

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
            state.id = action.payload.id
            state.inProgress=false
        },
        removePersonalData(state){
            state.name = null
            state.email = null
            state.role = null
            state.id = null
            state.inProgress=false
        },
        out(state) {
            state.isAuthenticated = false
        },
        endFetching(state)
        {
            state.inProgress = false
            state.errorMessage = null
        }
        ,
        handleError(state, action) {
            const { error } = action.payload
            state.errorMessage = error
            state.inProgress = false
        },
    },
})

const { handleError, loading, logged, out,setPersonalData,setSignUpMode,setLoginMode,removePersonalData,endFetching } = loginSlice.actions
export const reducer = loginSlice.reducer