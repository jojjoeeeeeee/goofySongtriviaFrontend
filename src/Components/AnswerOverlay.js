import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const AnswerOverlay = ({ isCorrect, score, questionId, isShow }) => {
  return (
    <>
      {isShow && questionId !== "" && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center items horizontally
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
            backdropFilter: "blur(10px)", // Background blur for glass effect
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle white border
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Light shadow for depth
            p: 4,
            zIndex: 1000,
            textAlign: "center", // Ensure text is centered
          }}
        >
          {isCorrect ? (
            <CheckCircleIcon sx={{ fontSize: 60, color: "#fac326" }} />
          ) : (
            <CancelIcon sx={{ fontSize: 60, color: "red" }} />
          )}

          <Box
            sx={{
              position: "relative", // Needed to position the + symbol relative to the score
              mt: 2,
            }}
          >
            <Typography variant="h5" color={isCorrect ? "#fac326" : "red"}>
              {score}
            </Typography>

            {/* Absolutely position the + symbol */}
            <Typography
              variant="h6"
              color={isCorrect ? "#fac326" : "red"}
              sx={{
                position: "absolute",
                left: "-15px", // Adjust this value to fine-tune the horizontal position
                top: "0",
              }}
            >
              +
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AnswerOverlay;
