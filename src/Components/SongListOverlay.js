import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import CountdownTimer from "./ContdownTimer";

const SongListOverlay = ({ songList, isOpen, cbOnCloseSongList }) => {
  const handleOnTimerRunOut = () => {
    cbOnCloseSongList();
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#635E85", // Changed to a darker purple
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Typography
              variant="h6"
              sx={{
                color: "#FFFFFF",
                mb: 2,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: { xs: "20px", md: "24px" },
              }}
            >
              "Song List"
            </Typography>

            <CountdownTimer
              initialSeconds={15}
              onComplete={handleOnTimerRunOut}
              startCountdown={isOpen}
              isInverted={false}
            />
            <List
              sx={{
                backgroundColor: "#635E85",
                width: "100%",
                maxWidth: { xs: "90%", md: "70%" },
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                overflow: "auto",
                maxHeight: "60vh",
                padding: "0",
                mt: 2,
                mx: { xs: "20px", md: "40px" },
              }}
            >
              {songList.map((song, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: { xs: "8px 10px", md: "10px 0" },
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      marginRight: "10px",
                      backgroundColor: "#FFFFFF", // Changed to a light peach color
                      color: "#000000", // Black text
                      borderRadius: "8px",
                      padding: "3px 8px",
                      fontWeight: "bold",
                      fontSize: { xs: "12px", md: "14px" },
                      display: "flex",
                      alignItems: "center",
                      marginLeft: { md: "20px" },
                    }}
                  >
                    {index + 1}
                  </Box>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: { xs: 40, md: 50 },
                        height: { xs: 40, md: 50 },
                        backgroundColor: "#BFA7D8", // Changed to a lighter avatar color
                        borderRadius: "10px",
                      }}
                      src={song.imageUrl}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span
                        style={{
                          color: "#FFDDC1", // Changed to light peach color
                          fontSize: { xs: "14px", md: "16px" },
                          fontWeight: "bold",
                        }}
                      >
                        {song.title}
                      </span>
                    }
                    secondary={
                      <span
                        style={{
                          color: "#DDDDDD", // Changed to a lighter gray for secondary text
                          fontSize: { xs: "12px", md: "14px" },
                        }}
                      >
                        {song.artist}
                      </span>
                    }
                    sx={{ marginLeft: "10px" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      )}
    </>
  );
};

export default SongListOverlay;