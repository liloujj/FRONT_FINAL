import {FormHelperText, Grid,Box,Typography,InputAdornment,Autocomplete, } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle'
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import { useFormik  } from 'formik';
import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AsyncRequstScan } from '../ScanSlice';
import { useTranslation } from "react-i18next";


import * as Yup from 'yup';

function handleError(schema, name) {

    if (schema.touched[name] && schema.errors[name]) {
        return schema.errors[name]
    }

    return null
}

export default function AiScanUploadDialog(props) {

    const { open, handleClose, isUpdate, model } = props
    const { scans} = useSelector((state) => state.scan)

    const dispatch = useDispatch() 

    const {t} = useTranslation()

    const schema = useFormik({
        initialValues: { scanId:''},
        validationSchema: Yup.object({
            scanId: Yup.object().required(t("Required.")),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            dispatch(AsyncRequstScan(values.scanId._id))
            handleClose()
        }
    })

    useEffect(()=>{
        if (scans.length!==0 )
        {   
            schema.setFieldValue('scanId',scans[0]);

        }else{
            schema.setFieldValue('scanId',"");
        }
    },[open])

    return (<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <Box component="form" onSubmit={schema.handleSubmit}>
                <DialogTitle>{t("Upload scan")}</DialogTitle>
                <DialogContent>
                    <Grid spacing={2} container sx={{alignItems:"center"}}>
                        <Grid item size={12}>
                            <Autocomplete
                            error={!!handleError(schema, "ScanId")}
                            helperText={handleError(schema, "ScanId")}
                            onChange={(even, value, reason) => {
                                console.log(value)
                                schema.setFieldValue('scanId', value);
                            }}
                            disablePortal
                            fullWidth
                            options={scans}
                            value={schema.values.scanId}
                            onBlur={schema.handleBlur}
                            getOptionLabel={(option) => {
                                return `${option.imageURL.split('/').pop()}`
                            }}
                            renderInput={(params) => {
                                return <TextField
                                    {...params}
                                    margin="dense"
                                    name="scan"
                                    label={t("Scan")}
                                />
                            }}
                        />

                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleClose()
                        }}
                    >{t("Cancel")}</Button>
                    <Button type="submit" >{t("Save")}</Button>
                </DialogActions>
            </Box>
    </Dialog>)
}