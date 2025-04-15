import { Autocomplete, Chip, FormHelperText, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

import { AsyncCreateAppointment } from '../AppointmentSlice';

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

    const schema = useFormik({
        initialValues: {
            patientID: (isUpdate) ? model?.patientID : "",
            date: (isUpdate) ? model?.date : dayjs('2025-04-17'),
            time: (isUpdate) ? model?.time : dayjs('15:30'),
            status: (isUpdate) ? model?.status : null,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            patientID: Yup.number()
                .required("Required."),
            date: Yup.date(),
            time: Yup.date(),
            status: Yup.string(),

        }),
        onSubmit: (values, { resetForm }) => {

            const data = {
                patientID: values.patientID,
                date: values.date,
                time: values.time,
                status: values.status,
            }

            if (!isUpdate) {

            } else {

            }
        }
    })

    const handleTimeChange = (newTime) => {
        
        schema.setFieldValue("time", newTime)
        schema.setFieldTouched("time", true, false)
    }

    const handleDateChange = (newDate) => {
        console.log(newDate)
        schema.setFieldValue("date", newDate.$d)
        schema.setFieldTouched("date", true, false)
    }
    
    

    return <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <form onSubmit={schema.handleSubmit}>
            <DialogTitle>{isUpdate ? "Update appointment" : "Create appointment"}</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container sx={{alignItems:"center"}}>
                    <DateCalendar onChange={handleDateChange} value={schema.values.date} disablePast />
                    <TimeClock  onChange={handleTimeChange} value={schema.values.time} disablePast maxTime={dayjs('T15:30')} minTime={dayjs('T8:00')} ampm={false} views={['hours',"minutes"]} minutesStep={15} defaultValue={dayjs('2022-04-17T15:30')} />                    
                </Grid>

                </LocalizationProvider>
                
                <Autocomplete
                    options={["waiting","done"]}
                    readOnly
                    defaultValue="waiting"
                    disabled
                    value={schema.values.status}
                    disablePortal
                    fullWidth
                    renderInput={(params)=>{                        
                        return <TextField fullWidth
                            {...params}
                            margin="dense"
                            name="Status"
                            label="Status"
                            type="select"
                        />
                    }}
                />
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
                        schema.resetForm()
                    }}
                >{"Cancel"}</Button>
                <Button type="submit" disabled={editInProgress}>{"Save"}</Button>
            </DialogActions>
        </form>
    </Dialog>
}