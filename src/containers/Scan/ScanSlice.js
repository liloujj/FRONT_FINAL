import { createSlice } from "@reduxjs/toolkit"
import axios from "../../helpers/axios"

import { t } from "i18next";

export function AsyncGetScans() {
    return async (dispatch) => {
        dispatch(fetching())
        const params = { read:false };
        try {
            const response = await axios.get(
                "/patient/scans",
            )
            const scans = response.data.scans
            console.log(scans)
            dispatch(setScans(scans))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleErrors({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleErrors({ error }))
            }
        }
    }
}

const initialState = {
    errorMessage: null,
    fetchingInProgress: false,
    scans: [],
}

const scanSlice = createSlice({
    name: "scan",
    initialState,
    reducers: {
        fetching(state) {
            state.fetchingInProgress = true
        },
        setScans(state, action) {
            state.scans = action.payload
            state.fetchingInProgress = false
        },
        handleErrors(state, action) {
            state.errorMessage = action.payload.error
            state.fetchingInProgress = false
        }
    },
})

const { fetching,handleErrors,setScans} = scanSlice.actions
export const reducer = scanSlice.reducer