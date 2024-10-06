import { Typography, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";

const CountdownOverlay = ({ initialSeconds, onComplete, startCountdown }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let timer;
    if (startCountdown && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setSeconds(initialSeconds);
      onComplete(); // Call the onComplete function when the countdown ends
    }

    return () => clearInterval(timer); // Cleanup timer on unmount or when dependencies change
  }, [startCountdown, seconds, onComplete]);

  return (
    seconds > 0 &&
    startCountdown && (
      <div style={overlayStyles}>
        <h1 style={countdownStyles}>{seconds}</h1>
        <Typography variant="h5" textAlign="center">
          "Best with headphone on"
        </Typography>
      </div>
    )
  );
};

const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  color: "white",
  fontFamily: "Arial, sans-serif",
  zIndex: 1000, // Ensure it appears above other elements
};

const countdownStyles = {
  fontSize: "5rem",
};

export default CountdownOverlay;
