import React, { useEffect, useState } from "react";
import { sessionSocket } from "../sessionSocket";
import { Grid, Typography, Button, TextField } from "@mui/material";
import ConnectSpotifyButton from "../Components/ConnectSpotifyButton";

const LoginScreen = ({ cbOnGetAccessToken, cbOnGetRoomCode }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [roomCode, setRoomCode] = useState(""); // State to hold the room code
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("access_token");

    if (token) {
      cbOnGetAccessToken(token);
      sessionSocket.emit("createRoom", { accessToken: token });
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    sessionSocket.on("roomCreated", (data) => {
      cbOnGetRoomCode(data.roomCode);
    });

    sessionSocket.on("gameInProgress", (data) => {
      setIsStarted(true);
      window.history.replaceState({}, document.title, `/?r=${data.roomCode}`);
    });

    sessionSocket.on("onResetGame", () => {
      setIsStarted(false);
      const query = new URLSearchParams(window.location.search);
      const roomCodeFromQuery = query.get("r");
      if (roomCodeFromQuery) {
        window.history.replaceState({}, document.title, `/?r=${roomCodeFromQuery}`);
        window.location.reload();
      }
    });

    sessionSocket.on("roomNotFound", () => {
      setError("Room code not found")
    });

    return () => {
      sessionSocket.off("roomCreated");
      sessionSocket.off("gameInProgress");
      sessionSocket.off("onResetGame");
    };
  }, []);

  // Handler for when "Join Game" is clicked
  const handleJoinGame = () => {
    if (roomCode.trim()) {
      cbOnGetRoomCode(roomCode.trim());
    } else {
      setError("Room code cannot be empty");
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "#3f3f3f" }}
    >
      <Grid item xs={3}>
        <Typography color={"white"} mb={3} variant="h3">
          Goofy Song Trivia
        </Typography>
      </Grid>

      <Grid item xs={3}>
        {isStarted ? (
          <Typography color={"white"} mb={3} variant="h5">
            Game in progress...
          </Typography>
        ) : (
          <>
            <Typography color={"white"} mb={3} variant="h6">
              Connect to spotify and Create room
            </Typography>
            <ConnectSpotifyButton />
            <Typography color={"white"} mt={1} mb={3} variant="h6">
              Or join a game
            </Typography>

            {/* TextField for Room Code */}
            <TextField
              placeholder={"Room Code ..."}
              variant="outlined"
              fullWidth
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              error={!!error} // Shows error state
              helperText={error} // Error message
              autoComplete="off"
              sx={{
                mb: 2,
                input: {
                  color: "#FFFFFF",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: 0,
                  },
                },
                "& .MuiInputBase-root": {
                  borderRadius: "23px",
                  backgroundColor: "#9F98D6",
                  "& input": {
                    height: "33px",
                    padding: "5px 20px",
                    borderRadius: "23px",
                    backgroundColor: "#9F98D6",
                  },
                  "&.Mui-focused fieldset": {
                    border: 0,
                  },
                },
              }} // Adjust styles for contrast
            />

            {/* Button to Join Game */}
            <Button
              variant="contained"
              onClick={handleJoinGame}
              fullWidth
              sx={{
                mb: 2,
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                color: "white",
                fontWeight: "bold",
                borderRadius: "50px",
                padding: "10px",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
                },
              }}
            >
              Join 🎉
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default LoginScreen;