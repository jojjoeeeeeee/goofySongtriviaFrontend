import React, { useEffect, useState, useRef } from "react";
import { sessionSocket } from "../sessionSocket";
import {
  Grid,
  Typography,
  TextField,
  FormGroup,
  Button,
  useMediaQuery,
  Avatar,
  Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LogoutIcon from "@mui/icons-material/Logout";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import PlayerListThree from "./PlayerListTree";
import ShareButton from "./ShareButton";

const GameJoin = ({ playersList, cbHandleOnStart, roomCode }) => {
  const [username, setUsername] = useState("");
  const [yourUsername, setYourUsername] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [avatarDataUri, setAvatarDataUri] = useState("");
  const hasJoinedRef = useRef(false);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const getGameUrl = () => {
    const { protocol, host } = window.location;
    return `${protocol}//${host}/?r=${roomCode}`;
  };

  useEffect(() => {
    sessionSocket.on("getPlayer", (userList) => {
      if (userList.length === 0) {
        window.location.reload();
      }
      const matchingPlayers = userList.filter(
        (player) => player.id === sessionSocket.id
      );
      if (matchingPlayers.length === 0) return;
      hasJoinedRef.current = true;
      setYourUsername(matchingPlayers[0].username);
      setAvatarDataUri(matchingPlayers[0].avatarDataUri);
      setIsHost(matchingPlayers[0].host);
    });

    return () => {
      sessionSocket.off("getPlayer");
    };
  }, []);

  useEffect(() => {
    const handleOnStartGameCountDown = () => {
      if (hasJoinedRef.current) {
        cbHandleOnStart();
      } else if (!hasJoinedRef.current) {
        window.history.replaceState({}, document.title, `/?r=${roomCode}`);
        window.location.reload();
      }
    }
    sessionSocket.on("onStartGameCountDown", handleOnStartGameCountDown);

    return () => {
      sessionSocket.off("onStartGameCountdown", handleOnStartGameCountDown);
    };
  }, []);

  const joinGame = () => {
    if (username !== "") {
      sessionSocket.emit("joinGame", { roomCode, username, avatarDataUri });
    }
  };

  const handleOnLeave = () => {
    sessionSocket.emit("hostDisconnect");
    window.location.reload();
  };

  const handleUsername = (e) => {
    if (e.target.value.length < 20) {
      setUsername(e.target.value);
      const avatar = createAvatar(adventurer, {
        seed: `${e.target.value}${randomFromTime()}`,
        backgroundColor: [
          "b6e3f4",
          "c0aede",
          "d1d4f9",
          "F5B8C5",
          "F5F1B8",
          "7394A0",
          "757241",
        ],
      });

      setAvatarDataUri(avatar.toDataUri());
    }
  };

  const randomFromTime = () => {
    // Get current time in milliseconds
    const now = Date.now();

    // Generate a random number based on the current time
    const randomValue = (now % 1000) / 1000; // Normalized to a float between 0 and 1

    return randomValue;
  };

  const handleOnStart = () => {
    sessionSocket.emit("startGame", { roomCode });
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography
          color={"white"}
          variant="h4"
          textAlign={"center"}
          mt={3}
          mb={3}
        >
          Goofy Song Trivia !<br />
          Game Room : {roomCode}
        </Typography>
      </Grid>
      {avatarDataUri !== "" && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          mb={1}
        >
          <Grid item xs={12}>
            <Avatar
              alt="Profile"
              src={avatarDataUri}
              sx={{ width: 100, height: 100, border: "2px solid #fff" }}
            />
          </Grid>
        </Grid>
      )}

      {yourUsername === "" &&
        (isDesktop ? (
          <FormGroup
            row
            sx={{
              borderRadius: "23px",
              backgroundColor: "#9F98D6",
              py: 2,
              px: 2,
              alignItems: "center",
              margin: "auto",
              display: "flex",
            }}
          >
            <TextField
              placeholder={"Nickname"}
              type="text"
              value={username}
              onChange={(e) => handleUsername(e)}
              autoComplete="off"
              sx={{
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
              }}
            />
            <Button
              variant="contained"
              size="medium"
              startIcon={<SportsEsportsIcon />}
              onClick={joinGame}
              sx={{
                color: "white",
                backgroundColor: "#817BAD",
                ":hover": {
                  backgroundColor: "#504C6B",
                },
                ml: "auto", // Pushes the button to the right
                mr: "8px", // Adds 8 pixels of margin to the right
              }}
            >
              Join Game
            </Button>
          </FormGroup>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <TextField
                placeholder={"Nickname"}
                type="text"
                value={username}
                onChange={(e) => handleUsername(e)}
                sx={{
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
                      width: "50vw",
                      padding: "5px 20px",
                      borderRadius: "23px",
                      backgroundColor: "#9F98D6",
                    },
                    "&.Mui-focused fieldset": {
                      border: 0,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} mt={1}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SportsEsportsIcon />}
                onClick={joinGame}
                sx={{
                  color: "white",
                  backgroundColor: "#307e4b",
                  ":hover": {
                    backgroundColor: "#296c40",
                  },
                  width: "60vw",
                }}
              >
                Join Game
              </Button>
            </Grid>
          </Grid>
        ))}
      <Box
        borderRadius={4}
        boxShadow={8}
        backgroundColor={"#817BAD"}
        my={3}
        p={3}
        overflow="hidden"
      >
        <Grid item xs={12} minHeight={80}>
          <PlayerListThree playersList={playersList} isPlaying={false} />
        </Grid>
      </Box>
      {hasJoinedRef.current && (
        <Grid item xs={12} display="flex" justifyContent="center">
          <ShareButton sharingUrl={getGameUrl()}/>
        </Grid>
      )}
      {isHost ? (
        <Grid container direction="row" spacing={4}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              size="medium"
              startIcon={<PlayArrowIcon />}
              onClick={() => handleOnStart()}
              sx={{
                color: "white",
                backgroundColor: "#fac326",
                ":hover": {
                  backgroundColor: "#eacd7b",
                },
              }}
            >
              Start
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              size="medium"
              startIcon={<LogoutIcon />}
              onClick={handleOnLeave}
              sx={{
                color: "white",
                backgroundColor: "#cd5435",
                ":hover": {
                  backgroundColor: "#FFBAA8",
                },
              }}
            >
              Leave
            </Button>
          </Grid>
          {/* <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={1}
          >
            <Grid item xs={12}>
              <TextField
                placeholder={"Search User for playlist"}
                type="text"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                sx={{
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
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                onClick={fetchUser}
                sx={{
                  color: "white",
                  backgroundColor: "#307e4b",
                  ":hover": {
                    backgroundColor: "#296c40",
                  },
                }}
              >
                Search User
              </Button>
            </Grid>
          </Grid> */}
        </Grid>
      ) : yourUsername !== "" && (
        <Grid item xs={12}>
          <Typography color={"white"} variant="h6" textAlign={"center"} my={1}>
            Host is selecting playlist . . .
          </Typography>
        </Grid>
      )}
    </>
  );
};

export default GameJoin;
