import React from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import PlayerBox from "./PlayerBox";

// Import medal images
import goldMedal from "../Assets/gold-medal.svg";
import silverMedal from "../Assets/silver-medal.svg";
import bronzeMedal from "../Assets/bronze-medal.svg";

const Podium = ({ topPlayers, players }) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
        minHeight: "60vh", // Full viewport height
        paddingBottom: "50px", // Add padding at the bottom for better spacing
      }}
    >
      {/* Top Podium */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around", // Space podiums evenly
          alignItems: "flex-end", // Align items at the bottom
          width: isDesktop ? "70%" : "100%", // 70% width on desktop, full width on mobile
          maxWidth: isDesktop ? "1200px" : "100%", // Optional: set a max width for better layout on larger screens
        }}
      >
        {/* Bronze Podium */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 1,
            width: "100px", // Set a fixed width for each podium
            position: "relative", // Allow positioning for overlapping
          }}
        >
          {topPlayers.length > 2 && (
            <PlayerBox player={topPlayers[2]} sx={{ mb: -3 }} />
          )}
          <Box
            boxShadow={8}
            sx={{
              width: "100%", // Full width of podium
              height: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              borderRadius: "12px 12px 0 0",
              background:
                "linear-gradient(to top, #3f3b5d, rgba(63, 59, 93, 0))",
              overflow: "visible", // Allow overlapping
            }}
          >
            <Box
              component="img"
              src={bronzeMedal}
              alt="Bronze Medal"
              sx={{ width: 50, height: 50, marginBottom: 1, marginX: "auto" }}
            />
          </Box>
        </Box>

        {/* Gold Podium (Centered) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 1,
            width: "100px", // Same fixed width
            position: "relative",
            zIndex: 1,
          }}
        >
          {topPlayers.length > 0 && (
            <PlayerBox player={topPlayers[0]} sx={{ mb: -4 }} />
          )}
          <Box
            boxShadow={8}
            sx={{
              width: "100%", // Full width of podium
              height: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              borderRadius: "12px 12px 0 0",
              background:
                "linear-gradient(to top, #3f3b5d, rgba(63, 59, 93, 0))",
              overflow: "visible", // Allow overlapping
            }}
          >
            <Box
              component="img"
              src={goldMedal}
              alt="Gold Medal"
              sx={{ width: 50, height: 50, marginBottom: 1, marginX: "auto" }}
            />
          </Box>
        </Box>

        {/* Silver Podium */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 1,
            width: "100px", // Same fixed width
            position: "relative",
          }}
        >
          {topPlayers.length > 1 && (
            <PlayerBox player={topPlayers[1]} sx={{ mb: -3 }} />
          )}
          <Box
            boxShadow={8}
            sx={{
              width: "100%", // Full width of podium
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              borderRadius: "12px 12px 0 0",
              background:
                "linear-gradient(to top, #3f3b5d, rgba(63, 59, 93, 0))",
              overflow: "visible", // Allow overlapping
            }}
          >
            <Box
              component="img"
              src={silverMedal}
              alt="Silver Medal"
              sx={{ width: 50, height: 50, marginBottom: 1, marginX: "auto" }}
            />
          </Box>
        </Box>
      </Box>

      {/* Bottom row with avatars */}
      <Grid
        item
        xs={12}
        minHeight={80}
        mb={5}
        sx={{ position: "fixed", bottom: 10, left: 0, right: 0 }}
      >
        <Grid
          container
          spacing={2}
          alignItems="flex-start"
          justifyContent="flex-start"
          width="100%"
          mx={0}
          mt={3}
          sx={{
            overflowY: "hidden",
            overflowX: "auto",
            flexWrap: "nowrap",
            "&::-webkit-scrollbar": {
              width: "5px",
              height: "15px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#504C6B",
              borderRadius: "12px",
              border: "3px solid transparent",
              backgroundClip: "content-box",
            },
          }}
        >
          {players.length > 0 &&
            players.map((player, index) => (
              <Grid item xs={3} sm={5} key={index} sx={{ minWidth: "120px" }}>
                <PlayerBox player={player} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Podium;
