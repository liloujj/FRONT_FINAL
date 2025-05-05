import { useState } from "react"
import { Container, Typography, Paper, Box, Switch, FormControlLabel } from "@mui/material"

import PaymentForm from "./Components/PaymentForm"
import PremiumSubscription from "./Components/PaymentSubscription"

export default function Payment (){
    const [isPremium, setIsPremium] = useState(false)

    return(
    <Container  sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Membership Portal
          </Typography>
          <FormControlLabel
            control={<Switch checked={isPremium} onChange={() => setIsPremium(!isPremium)} color="primary" />}
            label="Toggle Premium Status"
          />
        </Box>

        {isPremium ? <PremiumSubscription /> : <PaymentForm onSuccess={() => setIsPremium(true)} />}
      </Paper>
    </Container>
    )
}