import React, { useEffect, useState } from "react";
import { sessionSocket } from "../sessionSocket";
import { Grid, Typography } from "@mui/material";
import ConnectSpotifyButton from "../Components/ConnectSpotifyButton";

const LoginScreen = () => {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    sessionSocket.on("gameInProgress", () => {
      setIsStarted(true);
    });

    sessionSocket.on("onGameEnd", () => {
      setIsStarted(false);
    });

    return () => {
      sessionSocket.off("gameInProgress");
      sessionSocket.off("onGameEnd");
    };
  }, []);

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
          <ConnectSpotifyButton />
        )}
      </Grid>
    </Grid>
  );
};

export default LoginScreen;
