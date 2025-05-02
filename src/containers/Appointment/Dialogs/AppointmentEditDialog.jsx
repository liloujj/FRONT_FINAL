import { Autocomplete, Chip, FormHelperText, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AsyncCreateAppointment,AsyncEditAppointment } from '../AppointmentSlice';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useTranslation } from "react-i18next";

function handleError(schema, name) {

    if (schema.touched[name] && schema.errors[name]) {
        return schema.errors[name]
    }

    return null
}

export default function AppointmentEditDialog(props) {

    const dispatch = useDispatch()
    const { open, handleClose, isUpdate, model } = props
    const { editInProgress, errorMessage } = useSelector((state) => state.appointment)
    const { name } = useSelector((state) => state.login)

    const [dateTime,setDateTime] = useState(isUpdate ? dayjs(model.date) :dayjs("2025-04-03 T10:30"))
    const [status,setStatus] = useState(isUpdate ? model.status : "Pending")
    const {t} = useTranslation()

    const handleDateTimeChange = (newDateTime) => {
        setDateTime(dayjs(newDateTime))
    }
    
    const handleSubmit = () =>
    {
        console.log(dateTime)
        if (isUpdate)
        {
            dispatch(AsyncEditAppointment(model._id,dateTime,dateTime,status))
        }else{
            dispatch(AsyncCreateAppointment(dateTime,dateTime))
        }
        handleClose()
    }
    

    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{isUpdate ? t("Update appointment") : t("Create appointment")}</DialogTitle>
            <DialogContent>
                <Grid spacing={2} container sx={{alignItems:"center"}}>
                    <Grid item size={12}>
                        <TextField fullWidth
                                value={name}
                                disabled
                                margin="dense"
                                name="Name"
                                label={t("Name")}
                                type="select"
                            />
                    </Grid >
                    <Grid item container sx={{alignItems:"center"}} size={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker sx={{width:"100%"}} ampm={false} reduceAnimations onChange={handleDateTimeChange} orientation="landscape" disablePast actionBar={<></>} value={dateTime} />
                            </LocalizationProvider>
                    </Grid>
                    <Grid item size={12}>
                        <Autocomplete
                            options={["Pending","Cancelled"]}
                            value={status}
                            disabled={!isUpdate}
                            disablePortal
                            fullWidth
                            renderInput={(params)=>{                        
                                return <TextField fullWidth
                                    {...params}
                                    margin="dense"
                                    name="Status"
                                    label={t("Status")}
                                    type="select"
                                />
                            }}
                            />
                    </Grid>
                </Grid>
                {errorMessage && <Grid item xs={12}>
                    <FormHelperText error>
                        {errorMessage}
                    </FormHelperText>
                </Grid>}
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={editInProgress}
                    onClick={() => {
                        handleClose()
                    }}
                >{t("Cancel")}</Button>
                <Button type="submit" onClick={handleSubmit} disabled={editInProgress}>{t("Save")}</Button>
            </DialogActions>
    </Dialog>
}