import React from "react";
import { Avatar, Grid, Typography, useMediaQuery } from "@mui/material";

const PlayerBox = ({ player, sx }) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        ...sx,
        minHeight: isDesktop ? 140 : 100, // Ensure fixed height for layout consistency
        width: isDesktop ? 200 : "auto",  // Increase width only on desktop
      }}
    >
      <Avatar
        alt="profile_list"
        src={player.avatarDataUri}
        sx={{
          width: isDesktop ? 80 : 50,
          height: isDesktop ? 80 : 50,
          border: "2px solid #fff",
        }}
      />
      <Typography
        variant={isDesktop ? "h5" : "body1"}
        textAlign="center"
        color={player.isYou ? "#fac326" : "#fff"}
        sx={{
          whiteSpace: isDesktop ? "normal" : "normal", // Let text wrap normally
          wordBreak: "break-word", // Allow breaking long words
          maxWidth: "100%", // Ensure text doesn't exceed the box width
        }}
      >
        {player.isYou ? `${player.username} (You)` : player.username}
      </Typography>
      <Typography
        variant={isDesktop ? "h5" : "h6"}
        textAlign="center"
        color={player.isYou ? "#fac326" : "#fff"}
      >
        {player.score}
      </Typography>
    </Grid>
  );
};

export default PlayerBox;
