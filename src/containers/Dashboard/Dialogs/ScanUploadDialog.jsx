import {FormHelperText, Grid,Box,Typography,InputAdornment,Autocomplete, } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle'
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import {useEffect, useState} from 'react';
import {  FileText } from "lucide-react"
import { useDispatch, useSelector } from 'react-redux';
import { AsyncUploadScan } from "../DashboardActions";

import { useTranslation } from "react-i18next";


import * as Yup from 'yup';

export default function ScanUploadDialog(props) {

    const [file,setFile] = useState("")
    const [patientID,setPatientID] = useState("")
    const { open, handleClose, isUpdate, model } = props

    const {users} = useSelector((state)=>state.user)

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0])
        }
    }

    const {t} = useTranslation()

    const handleSubmit = () =>
    {
        const formData = new FormData();
        formData.append('image', file);
        AsyncUploadScan(patientID._id,formData)
        handleClose()
    }

    useEffect(()=>{
        setFile("")
        setPatientID("")
    },[open])
    


    return (<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{t("Upload scan")}</DialogTitle>
            <DialogContent>
                <Grid spacing={2} container sx={{alignItems:"center"}}>
                    <Grid item size={12}>
                        <Autocomplete
                        onChange={(even, value, reason) => {
                            setPatientID(value) // Value : Patient
                        }}
                        disablePortal
                        fullWidth
                        options={users.filter((element)=>element.role==="Patient")}
                        value={patientID}
                        getOptionLabel={(option) => {
                            return `${option.name}`
                        }}
                        renderInput={(params) => {
                            return <TextField
                                {...params}
                                margin="dense"
                                name="patient"
                                label={t("Patient")}
                            />
                        }}
                    />

                    </Grid>
                    <Grid item size={12}>
                    <Box
                      sx={{
                        border: "2px dashed #cbd5e1",
                        borderRadius: 2,
                        p: 3,
                        "&:hover": {
                          borderColor: "#439DEC",
                          transition: "border-color 0.2s",
                        },
                      }}
                    >
                      <Box
                        component="label"
                        htmlFor="scan-document"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                                >
                                <FileText color="#94a3b8" size={32} />
                                <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#334155" }}>
                                    {t("Upload Medical Scan")}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                    {t("PDF, JPG or PNG (max. 5MB)")}
                                </Typography>
                                <input
                                    id="scan-document"
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => document.getElementById("scan-document")?.click()}
                                    
                                >
                                    {t("Select Document")}
                                </Button>
                                {file && (
                                    <Typography sx={{ fontSize: "0.75rem", color: "#059669", mt: 1 }}>
                                    {file.name} {t("selected")}
                                    </Typography>
                                )}
                                </Box>
                            </Box>
                        </Box>
                    </Grid >
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        handleClose()
                    }}
                >{t("Cancel")}</Button>
                <Button type="submit" onClick={()=>handleSubmit()} >{t("Save")}</Button>
            </DialogActions>
    </Dialog>)
}