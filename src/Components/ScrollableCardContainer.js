import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Radio,
  FormControlLabel,
  FormControl,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { sessionSocket } from "../sessionSocket";

const ScrollableCardContainer = ({ cardData, roomCode }) => {
  const [selectedCard, setSelectedCard] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  useEffect(() => {
    sessionSocket.on("onSelectedPlaylist", (playlistId) => {
      setSelectedCard(playlistId);
    });

    sessionSocket.on("getPlayer", (userList) => {
      const matchingPlayers = userList.filter(
        (player) => player.id === sessionSocket.id
      );
      if (matchingPlayers.length === 0) return;
      setIsJoined(true);
    });

    return () => {
      sessionSocket.off("onSelectedPlaylist");
      sessionSocket.off("getPlayer");
    };
  }, []);

  useEffect(() => {
    const playlistsData = fillArrayToMultipleOfThree(cardData, {
      isFilled: true,
    });
    setPlaylists(playlistsData);
  }, [cardData]);

  useEffect(() => {
    if (playlists.length > 0) {
      sessionSocket.emit("selectPlaylist", { roomCode, playlistId: playlists[0].id });
    }
  }, [isJoined]);

  const handleRadioChange = (event) => {
    sessionSocket.emit("selectPlaylist", { roomCode, playlistId: event.target.value });
  };

  const handleSelectCard = (id) => {
    sessionSocket.emit("selectPlaylist", { roomCode, playlistId: id });
  };

  const fillArrayToMultipleOfThree = (arr, fillValue) => {
    const length = arr.length;
    const remainder = length % 3;

    if (remainder === 0) return arr; // No need to fill

    const fillCount = 3 - remainder; // Number of elements to add
    const filledArray = arr.concat(Array(fillCount).fill(fillValue));
    return filledArray;
  };

  return playlists.length > 0 && isJoined ? (
    <>
      <Grid
        item
        xs={12}
        mb={1}
        sx={{
          WebkitBoxShadow: "0px 14px 8px -5px rgba(0,0,0,0.1)",
          MozBoxShadow: "0px 14px 8px -5px rgba(0,0,0,0.1)",
          boxShadow: "0px 14px 8px -5px rgba(0,0,0,0.1)",
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          mx={1}
          mb={1}
        >
          <Grid item xs={10}>
            <Typography color="white" variant="h5" textAlign="left">
                Spotify host playlist!
            </Typography>
          </Grid>
          <Grid item xs>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid item xs>
                <Box
                  component="img"
                  width={30}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1200px-Spotify_icon.svg.png"
                  alt="Spotify Icon"
                  sx={{ ml: 1 }} // Add some margin-left for spacing between text and image
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: isDesktop ? "300px" : "200px",
          overflowX: "hidden",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "15px",
            height: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#504C6B",
            borderRadius: "12px",
            border: "3px solid transparent",
            backgroundClip: "content-box",
          },
        }}
      >
        <Grid container spacing={1}>
          {playlists.map((card, index) =>
            card.isFilled ? (
              <Grid item xs={4} key={index}>
                <Box width={136} height={169} />
              </Grid>
            ) : (
              <Grid item xs={4} key={card.id}>
                <Card
                  sx={{
                    boxShadow: 0,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    handleSelectCard(card.id);
                  }}
                >
                  <CardContent>
                    <Box
                      component="img"
                      src={card.image}
                      alt={card.title}
                      borderRadius={4}
                      sx={{
                        width: 100,
                        height: 100,
                        border:
                          card.id === selectedCard
                            ? "2px solid white"
                            : "2px solid transparent",
                      }}
                    />
                    <Typography
                      variant="body"
                      component="div"
                      sx={{ mt: 1 }}
                      color={card.id === selectedCard ? "white" : "black"}
                    >
                      {card.title}
                    </Typography>
                  </CardContent>
                  <FormControl
                    component="fieldset"
                    sx={{ position: "absolute", top: 0, right: 0, m: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          checked={card.id === selectedCard}
                          value={card.id}
                          onChange={handleRadioChange}
                          sx={{ display: "none" }} // Hide the default radio button
                        />
                      }
                      label=""
                    />
                  </FormControl>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Grid>
    </>
  ) : (
    <Typography variant="body" color="white" mx={2} my={2}>
      Loading ... / No available playlists
    </Typography>
  );
};

export default ScrollableCardContainer;
