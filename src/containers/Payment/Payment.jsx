import { useState } from "react"
import { Container, Typography, Paper, Box, Switch, FormControlLabel } from "@mui/material"

import PaymentForm from "./Components/PaymentForm"
import PremiumSubscription from "./Components/PaymentSubscription"

import { useSelector } from "react-redux"

export default function Payment (){
    const [isPremium, setIsPremium] = useState(false)

    const  {isPatientPremium} = useSelector((state)=>state.payment)


    return(
    <Container  sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Membership Portal
          </Typography>
        </Box>

        {isPatientPremium ? <PremiumSubscription /> : <PaymentForm />}
      </Paper>
    </Container>
    )
}