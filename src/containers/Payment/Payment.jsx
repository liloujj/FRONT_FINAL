/*import { useState } from "react"
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
}*/


import React, { useState, useEffect } from "react";
import axios from "axios";

const Plans = () => {
  const user = {
    _id: "6807504a86e0dee81305b5be",
    email: "bouarioualisa124@gmail.dz",
  };

  const [selectedDuration, setSelectedDuration] = useState("month");
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const plans = [
    {
      _id: { $oid: "6807504a86e0dee81305b5be" },
      paymentId: "price_1RLkZCQ2etjb7mmH23JUnSw8",
      link: "https://buy.stripe.com/test_cN2dTn4Qm9hf836000",
      name: "Gold",
      duration: "month",
      price: 19,
      description: "Monthly Gold Membership",
      benefits: [
        "Learn With Us",
        "Discount of 10% on all Courses",
        "All Blogs Are Free",
        "Fresh Researches",
      ],
      discount: 10,
    },
    // Add more plans if needed
  ];

  useEffect(() => {
    const checkExistingSubscription = async () => {
      try {
        const response = await axios.get("/api/subscriptions/" + user._id);
        setCurrentSubscription(response.data.localSubscription);
      } catch (err) {
        console.error("Error checking subscription:", err);
      }
    };

   // checkExistingSubscription();
  }, [user._id]);

  const handleSubscription = async (plan) => {
    setIsLoading(true);
    setError(null);

    try {
      if (currentSubscription) {
        const confirmCancel = window.confirm(
          "You have an existing subscription. Choosing a new plan will cancel the current one. Continue?"
        );
        if (!confirmCancel) {
          setIsLoading(false);
          return;
        }

        await axios.post("/api/payments/cancel", {
          subscriptionId: currentSubscription.subID,
        });
      }

      const response = await axios.post("http://localhost:8000/payment/create", {
        patientId: user._id,
        paymentMethodId: "pm_card_visa",
        priceId: plan.paymentId,
      });

      setCurrentSubscription({
        subID: response.data.subscriptionId,
        expDate: new Date(Date.now() + 30 * 24 * 60 *  60*  1000),
      });

      window.location.href = plan.link;
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to process subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlans = () => {
    const filteredPlans = plans.filter((plan) => plan.duration === selectedDuration);

    if (filteredPlans.length === 0) {
      return (
        <p className="text-center">No {selectedDuration}ly plans available.</p>
      );
    }
    return (
      <div className="flex w-full justify-center gap-5 flex-wrap items-stretch">
        {filteredPlans.map((plan, i) => (
          <div
            key={plan._id.$oid}
            className={`border relative text-black mt-5 rounded-lg py-5 shadow-md w-[350px] hover:shadow-lg transition bg-white px-4 pt-12 ${
              i === 1 && filteredPlans.length === 3 ? "-translate-y-4" : ""
            }`}
          >
            {plan.discount > 20 && (
              <div className="absolute top-0 text-[1.3rem] font-semibold left-0 w-full text-center py-2 bg-primary text-white rounded-md -translate-y-1/3">
                Best Value
              </div>
            )}
            <h3 className="font-semibold text-[2.75rem] mb-3 text-center">
              {plan.name}
            </h3>
            <p className="text-[1.2rem] text-black text-center">
              {plan.description}
            </p>
            <p className="text-[3rem] text-primary font-bold mt-2 text-center">
              ${plan.price}
            </p>
            <p className="text-center -mt-3 text-primary">
              ${plan.price}/{selectedDuration}
              {plan.discount > 0 && (
                <span className="block text-sm text-green-600">
                  {plan.discount}% discount on courses
                </span>
              )}
            </p>
            <button
              onClick={() => handleSubscription(plan)}
              disabled={isLoading}
              className="bg-red-700 text-white min-w-[120px] py-3 my-5 block mx-auto w-[60%] text-center font-bold rounded-lg text-[1.2rem] cursor-pointer hover:bg-primary-dark transition disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Choose Plan"}
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            <ul className="mt-2 text-[1.1rem] list-none list-inside text-gray-800 border-t border-gray-300 pt-5">
              {plan.benefits.map((benefit, index) => (
                <li className="mb-3 flex items-start" key={index}>
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 w-full relative mx-auto pt-[100px] bg-gray-50 min-h-[100dvh] overflow-y-auto">
      <h2 className="text-[3rem] font-semibold capitalize text-black text-center mb-2">
        Choose Your Plan
      </h2>

      {currentSubscription && (
        <div className="text-center mb-4 bg-yellow-100 p-3 rounded">
          Current Subscription Expires:{" "}
          {new Date(currentSubscription.expDate).toLocaleDateString()}
        </div>
      )}

      <div className="flex justify-center mb-10">
        <button
          onClick={() => setSelectedDuration("month")}
          className={`px-4 py-2 mr-2 rounded-lg transition ${
            selectedDuration === "month"
              ? "bg-black text-white"
              : "bg-white text-black border border-gray-300"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedDuration("year")}
          className={`px-4 py-2 rounded-lg transition ${
            selectedDuration === "year"
              ? "bg-black text-white"
              : "bg-white text-black border border-gray-300"
          }`}
        >
          Yearly
        </button>
      </div>

      {renderPlans()}
    </div>
  );
};

export default Plans;