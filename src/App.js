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
  const [session, setSession] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("access_token");
    if (token) {
      setAccessToken(token);
      setSession(true);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    sessionSocket.emit("searchSession");
    sessionSocket.on("getSession", (data) => {
      const { userList, accessToken } = data;
      if (userList.length === 0) return;
      setPlayers(userList);
      setSession(true);
      setAccessToken(accessToken);
    });

    return () => {
      sessionSocket.off("getSession");
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/callback" element={<div>Redirecting...</div>} />
          <Route
            path="/"
            element={
              session ? (
                <Navigate to="/game" />
              ) : !accessToken ? (
                <LoginScreen />
              ) : (
                <Navigate to="/game" />
              )
            }
          />
          <Route
            path="/game"
            element={
              accessToken ? (
                <GameRoom accessToken={accessToken} playersList={players} />
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
