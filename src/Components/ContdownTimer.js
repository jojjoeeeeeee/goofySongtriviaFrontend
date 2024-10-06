import React, { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';

const CountdownTimer = ({ initialSeconds, onComplete, startCountdown, isInverted, cbTimeRemain }) => {
  const [seconds, setSeconds] = useState(isInverted ? 0 : initialSeconds - 0.3);
  const [progress, setProgress] = useState(isInverted ? 0 : 100); // Start at 100%

  useEffect(() => {
    if (!isInverted) {
        let timer;
        if (startCountdown && seconds > 0) {
          timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                const newSeconds = Math.round((prevSeconds - 0.1) * 100) / 100;
                return Math.max(0, newSeconds);
            });
          }, 100);
          if (cbTimeRemain) {
            cbTimeRemain(seconds + 0.3);
          }
        } else if (seconds === 0) {
          setSeconds(0);
          setProgress(0);
          onComplete(); // Call the onComplete function when the countdown ends
        }
    
        // Update progress as a percentage
        setProgress((seconds / initialSeconds) * 100);

        return () => clearInterval(timer); // Cleanup timer on unmount or when dependencies change
    } else if (isInverted) {
        let timer;
        if (startCountdown && seconds < initialSeconds) {
          timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                const newSeconds = Math.round((prevSeconds + 0.1) * 100) / 100;
                return Math.min(initialSeconds, newSeconds);
            });
          }, 100);
        } else if (seconds === initialSeconds) {
          setSeconds(initialSeconds);
          setProgress(100);
          onComplete(); // Call the onComplete function when the countdown ends
        }
    
        // Update progress as a percentage
        setProgress((seconds / initialSeconds) * 100);

        return () => clearInterval(timer); // Cleanup timer on unmount or when dependencies change
    }
    
  }, [startCountdown, seconds, onComplete, isInverted]);

  return (
    (seconds > 0 && startCountdown) && (
        <LinearProgress variant="determinate" value={progress} sx={{
            width: '70vw',
            height: '15px',               // Height of the progress bar
            borderRadius: '10px',         // Corner radius
            backgroundColor: '#5f5b7c',   // Background color of the track
            '& .MuiLinearProgress-bar': {
              borderRadius: '10px',       // Corner radius for the progress fill
              backgroundColor: '#a69edc', // Color of the progress fill
            },
          }} />
    )
  );
};

export default CountdownTimer;