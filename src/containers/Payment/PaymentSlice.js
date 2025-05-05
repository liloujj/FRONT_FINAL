import { createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../configs"
import axios from "../../helpers/axios"
import toast from "react-hot-toast"

import { t } from "i18next";


export function AsyncIsPatientPremium() {
    return async (dispatch) => {
        dispatch(loading())

        try {
            
            const response = await axios.get("/patient/premium")
            console.log("test")
            if (response.status === 200)
            {
                console.log(response.data)
                const {subscription, isPatientPremium} = response.data
                dispatch(setPatientPremium(isPatientPremium))
                dispatch(setSubscription(subscription))
            }
            
        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            } else if (response && response.status === 404){
                dispatch(setSubscription(null))
                dispatch(setPatientPremium(false))
            }else {
                const error = t("Something went wrong, Try again")
                dispatch(handleError({ error }))
            }
        }
    }
}

export function AsyncCreateSubscription(patientId,paymentMethodId,priceId) {
    return async (dispatch) => {
        dispatch(loading())

        try {
            const response = await axios.post(
                "/payment/create",
                {
                    patientId,paymentMethodId,priceId
                }
                ,
                {
                    baseURL: BASE_URL,
                }
                
            )
            toast(t("Subscription has been created"))
            
        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleError({ error }))
            }
        }
    }
}

const initialState = {
    inProgress: false,
    errorMessage: null,
    subscription :null,
    isPatientPremium:false,
}

const paymentrSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        loading(state) {
            state.inProgress = true
            state.errorMessage = null
        },
        setSubscription(state,action){
            state.subscription = action.payload
        },
        setPatientPremium(state,action){
            state.isPatientPremium = action.payload
        },
        handleError(state, action) {
            const { error } = action.payload
            state.errorMessage = error
            state.inProgress = false
        },
    },
})

const { handleError, loading,setSubscription,setPatientPremium} = paymentrSlice.actions
export const reducer = paymentrSlice.reducer