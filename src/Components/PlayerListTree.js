import React, { useEffect, useState } from "react";
import { Grid, Typography, Avatar, Box, useMediaQuery } from "@mui/material";
import { sessionSocket } from "../sessionSocket";

const PlayerListThree = ({ playersList, isPlaying }) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    sessionSocket.on("getPlayer", (userList) => {
      userList = userList.map((player) => {
        return {
          id: player.id,
          avatarDataUri: player.avatarDataUri,
          username: player.username,
          host: player.host,
          score: player.score,
          isYou: player.id === sessionSocket.id,
        };
      });

      if (!isPlaying) {
        userList = fillArrayToMultipleOfThree(userList, { isFilled: true });
      }
      setPlayers(userList);
    });

    return () => {
      sessionSocket.off("getPlayer");
    };
  }, []);

  useEffect(() => {
    if (playersList.length > 0) {
      playersList = playersList.map((player) => {
        return {
          id: player.id,
          avatarDataUri: player.avatarDataUri,
          username: player.username,
          host: player.host,
          score: player.score,
          isYou: player.id === sessionSocket.id,
        };
      });

      if (!isPlaying) {
        playersList = fillArrayToMultipleOfThree(playersList, {
          isFilled: true,
        });
      }
      setPlayers(playersList);
    }
  }, [playersList]);

  const fillArrayToMultipleOfThree = (arr, fillValue) => {
    const length = arr.length;
    const remainder = length % 3;

    if (remainder === 0) return arr; // No need to fill

    const fillCount = 3 - remainder; // Number of elements to add
    const filledArray = arr.concat(Array(fillCount).fill(fillValue));
    return filledArray;
  };

  return isPlaying ? (
    <Grid
      container
      spacing={2}
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
      mx={0}
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
        }
      }}
    >
      {players.length > 0 ? (
        players.map((player, index) => (
          <Grid item xs={3} sm={5} key={index} sx={{minWidth: "120px"}}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                alt="profile_list"
                src={player.avatarDataUri}
                sx={
                  isDesktop
                    ? { width: 80, height: 80, border: "2px solid #fff" }
                    : { width: 50, height: 50, border: "2px solid #fff" }
                }
              />
              <Typography
                variant={isDesktop ? "h5" : "body1"}
                textAlign="center"
                color={player.isYou ? "#fac326" : "#fff"}
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
          </Grid>
        ))
      ) : !isPlaying && (
        <Typography variant="body" color="white" mx={2} my={2}>
          No one here ㅠㅠ
        </Typography>
      )}
    </Grid>
  ) : (
    <Grid container spacing={2} alignItems="flex-start" justifyContent="center">
      {players.length > 0 ? (
        players.map((player, index) =>
          player.isFilled ? (
            <Grid item xs={4} key={index}>
              <Box sx={{ width: 40, height: 40 }} />
            </Grid>
          ) : (
            <Grid item xs={4} key={index}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Avatar
                  alt="profile_list"
                  src={player.avatarDataUri}
                  sx={{ width: 40, height: 40, border: "2px solid #fff" }}
                />
                <Typography
                  variant="body"
                  textAlign="center"
                  color={player.isYou ? "#fac326" : "#fff"}
                >
                  {player.isYou ? `${player.username} (You)` : player.username}
                </Typography>
              </Grid>
            </Grid>
          )
        )
      ) : (
        <Typography variant="body" color="white" mx={2} my={2}>
          No one here ㅠㅠ
        </Typography>
      )}
    </Grid>
  );
};

export default PlayerListThree;
