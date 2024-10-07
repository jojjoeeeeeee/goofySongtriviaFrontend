import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GameRoom from "./Screen/GameRoom";
import { sessionSocket } from "./sessionSocket";
import LoginScreen from "./Screen/LoginScreen";
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [players, setPlayers] = useState([]);
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const roomCodeFromQuery = query.get("r");

    if (roomCodeFromQuery) {
      setRoomCode(roomCodeFromQuery);
    }
  }, []);

  useEffect(() => {
    if (roomCode) {
      sessionSocket.emit("searchSession", { roomCode });
    }

    sessionSocket.on("getSession", (data) => {
      const { userList, accessToken } = data;
      if (userList.length === 0) return;
      setPlayers(userList);
      setAccessToken(accessToken);
    });

    return () => {
      sessionSocket.off("getSession");
    };
  }, [roomCode]);

  const handleOnGetAccessToken = (accessToken) => {
    setAccessToken(accessToken);
  }

  const handleOnGetRoomCode = (roomCode) => {
    setRoomCode(roomCode);
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/callback" element={<div>Redirecting...</div>} />
          <Route
            path="/"
            element={
              !(accessToken && roomCode) ? (
                <LoginScreen cbOnGetAccessToken={handleOnGetAccessToken} cbOnGetRoomCode={handleOnGetRoomCode} />
              ) : (
                <Navigate to="/game" />
              )
            }
          />
          <Route
            path="/game"
            element={
              (accessToken && roomCode) ? (
                <GameRoom accessToken={accessToken} playersList={players} roomCode={roomCode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
