import { Container, Typography,Grid,TextField,Box,Paper,Button,Select,MenuItem,InputAdornment } from "@mui/material"
import * as Yup from 'yup';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik"

import { editPersonalData } from "../Login/LoginSlice";
import { useTranslation } from "react-i18next";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function changePasswordAsync(){
    console.log("Password")
}

function handleError(schema, name) {

    if (schema.touched[name] && schema.errors[name]) {
        return schema.errors[name]
    }

    return null
}

export default function Settings ()
{

    const dispatch = useDispatch()

    const {name} = useSelector((state)=>state.login)
    const {t,i18n } = useTranslation()
    const [changePasswordMessage, setChangePasswordMessage] = useState({})

    const [lang,setLang] = useState("en")

    const handleChangeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const changePasswordSchema = useFormik({
        initialValues: { password: '', new_password: '', confirm_new_password: '' },
        validationSchema: Yup.object({
            password: Yup.string().required(t("Required.")),
            new_password: Yup.string().required(t("Required.")),
            confirm_new_password: Yup.string().required(t("Required."))
        }),
        onSubmit: (values) => {
            dispatch(editPersonalData(values.password,values.new_password, () => {
                // success
                setChangePasswordMessage({
                    message: t("The password changed with success"),
                    type: "success"
                })

                changePasswordSchema.resetForm()
                changePasswordSchema.setSubmitting(false)
            }, (error) => {
                // error
                setChangePasswordMessage({
                    message: error,
                    type: "error"
                })

                changePasswordSchema.setSubmitting(false)
            }))
        }
    })
    return (<Container >
                <Box mt={3}>
                    <Typography textAlign="left" variant="h5" component="h2" fontWeight="bold" gutterBottom >
                        {t("Change password")}
                    </Typography>
                </Box>
                <Paper sx={{marginTop:4}} >
                    <Box p={2}>
                        <form onSubmit={changePasswordSchema.handleSubmit}>
                            <Grid container  spacing={2}>
                                <Grid container item size={12} alignItems="center">
                                    <Grid item size={4}>
                                        <Typography textAlign="left" variant="subtitle1" gutterBottom component="div">
                                            {t("Name")}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={8}>
                                        <TextField
                                            name="name"
                                            value = {name}
                                            disabled
                                            size="small"
                                            fullWidth />
                                    </Grid>
                                </Grid>
                                <Grid container item size={12} alignItems="center">
                                    <Grid item size={4}>
                                        <Typography textAlign="left" variant="subtitle1" gutterBottom component="div">
                                            {t("Password")}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={8}>
                                        <TextField
                                            name="password"
                                            value={changePasswordSchema.values.password}
                                            onChange={changePasswordSchema.handleChange}
                                            onBlur={changePasswordSchema.handleBlur}
                                            size="small"
                                            type="password"
                                            error={Boolean(handleError(changePasswordSchema, "password"))}
                                            helperText={handleError(changePasswordSchema, "password")}
                                            fullWidth />
                                    </Grid>
                                </Grid>
                                <Grid container item size={12} alignItems="center">
                                    <Grid item size={4}>
                                        <Typography textAlign="left" variant="subtitle1" gutterBottom component="div">
                                            {t("New password")}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={8}>
                                        <TextField
                                            name="new_password"
                                            value={changePasswordSchema.values.new_password}
                                            onChange={changePasswordSchema.handleChange}
                                            onBlur={changePasswordSchema.handleBlur}
                                            size="small"
                                            type="password"
                                            error={Boolean(handleError(changePasswordSchema, "new_password"))}
                                            helperText={handleError(changePasswordSchema, "new_password")}
                                            fullWidth />
                                    </Grid>
                                </Grid>
                                <Grid container item size={12} alignItems="center">
                                    <Grid item  size={4}>
                                        <Typography textAlign="left" variant="subtitle1" gutterBottom component="div">
                                            {t("Confirm new password")}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={8}>
                                        <TextField
                                            name="confirm_new_password"
                                            value={changePasswordSchema.values.confirm_new_password}
                                            onChange={changePasswordSchema.handleChange}
                                            onBlur={changePasswordSchema.handleBlur}
                                            size="small"
                                            type="password"
                                            error={Boolean(handleError(changePasswordSchema, "confirm_new_password"))}
                                            helperText={handleError(changePasswordSchema, "confirm_new_password")}
                                            fullWidth />
                                    </Grid>
                                </Grid>
                                <Grid container item size={12} alignItems="center" justifyContent="end">
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        type="submit"
                                        disabled={changePasswordSchema.isSubmitting}>
                                        {t("Submit")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
                <Box mt={3}>
                    <Typography textAlign="left" variant="h5" component="h2" fontWeight="bold" gutterBottom >
                        {t("Change language")}
                    </Typography>
                </Box>
                <Paper sx={{marginTop:4}}>
                    <Box p={2} >
                        <Grid container  spacing={2}>
                            <Grid container item size={12} alignItems="center">
                                <Grid item size={4}>
                                    <Typography textAlign="left" variant="subtitle1" gutterBottom component="div">
                                        {t("Language")}
                                    </Typography>
                                </Grid>
                                <Grid item size={8}>
                                    <Select
                                        onChange={(e)=>handleChangeLanguage(e.target.value)}
                                        fullWidth
                                        labelId="language-filter-label"
                                        defaultValue={i18n.language}
                                        label={t("Language")}
                                        >
                                        <MenuItem value="en">{t("English")}</MenuItem>
                                        <MenuItem value="fr">{t("French")}</MenuItem>

                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
    </Container>)
}