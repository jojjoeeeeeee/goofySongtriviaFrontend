import React, { useEffect, useState } from "react";
import { sessionSocket } from "../sessionSocket";
import { Grid, Typography, useMediaQuery, Box, Button } from "@mui/material";
import CountdownTimer from "./ContdownTimer";
import PlayerListThree from "./PlayerListTree";
import AnswerOverlay from "./AnswerOverlay";
import Podium from "./Podium";

const Trivia = ({
  playersList,
  cbOnAutoPlay,
  cbOnLoadAudio,
  cbOnMuteAudio,
  cbOnResetGame,
}) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [questionName, setQuestionName] = useState("");
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState("");
  const [countdownActive, setCountdownActive] = useState(false);
  const [questionCountdownActive, setQuestionCountdownActive] = useState(false);
  const [questionTimeRemain, setQuestionTimeRemain] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerOptions, setAnswerOpions] = useState([]);
  const [showAnswerOverlay, setShowAnswerOverlay] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answerQuestionId, setAnswerQuestionId] = useState("");
  const [endCountdownActive, setEndCountdownActive] = useState(false);
  const [showPodium, setShowPodium] = useState(false);
  const [resultTopPlayers, setResultTopPlayers] = useState([]);
  const [resultPlayers, setResultPlayers] = useState([]);

  const handleQuestionTimeRemain = (seconds) => {
    setQuestionTimeRemain(seconds);
  };

  const handleAnswerClick = (answer) => {
    if (!countdownActive && selectedAnswer === "") {
      sessionSocket.emit("submitAnswer", {
        answer,
        timeRemain: questionTimeRemain,
      });
      setSelectedAnswer(answer);
    }
  };

  const startPreQuestionCountdown = () => {
    setShowAnswerOverlay(true);
    setCountdownActive(true);
  };

  const handlePreQuestionCountdownComplete = () => {
    setCountdownActive(false);
    cbOnAutoPlay();
    startQuestionCountdown();
    setShowAnswerOverlay(false);
    setAnswerQuestionId("noAnswer");
    setScore(0);
    setIsCorrect(false);
  };

  const startQuestionCountdown = () => {
    setQuestionCountdownActive(true);
  };

  const handleQuestionCountdownComplete = () => {
    setQuestionCountdownActive(false);
  };

  const startEndCountdown = () => {
    setShowAnswerOverlay(true);
    setEndCountdownActive(true);
    setAnswerOpions([]);
    setQuestionName("The winner is ...");
  };

  const handleEndCountdown = () => {
    setEndCountdownActive(false);
    setShowAnswerOverlay(false);
    setQuestionName("");
    setShowPodium(true);
  };

  const handlePodiumCountdown = () => {
    //need to move this after song list ended
    sessionSocket.emit("onGameEndGetSongList");
  };

  useEffect(() => {
    const handleGetQuestion = (data) => {
      setSelectedAnswer("");
      console.log("Received question data:", data.trivia);
      cbOnLoadAudio(data.trivia.audioUrl);
      setQuestionName(data.trivia.question);
      setAnswerOpions(data.trivia.choices);
      setCurrentQuestionNumber(`${data.trivia.id + 1} / 10`);
      startPreQuestionCountdown();
    };

    const handleOnGetAnswer = (data) => {
      setAnswerQuestionId(data.id);
      setScore(data.roundScore);
      setIsCorrect(data.isCorrect);
    };

    const handleOnGameEnd = (data) => {
      cbOnMuteAudio();
      startEndCountdown();
      data.topPlayers = data.topPlayers.map((player) => {
        return {
          id: player.id,
          avatarDataUri: player.avatarDataUri,
          username: player.username,
          host: player.host,
          score: player.score,
          isYou: player.id === sessionSocket.id,
        };
      });

      data.players = data.players.map((player) => {
        return {
          id: player.id,
          avatarDataUri: player.avatarDataUri,
          username: player.username,
          host: player.host,
          score: player.score,
          isYou: player.id === sessionSocket.id,
        };
      });

      setResultTopPlayers(data.topPlayers);
      setResultPlayers(data.players);
    };

    const handleOnResetGame = (data) => {
      cbOnResetGame(data);
    };

    sessionSocket.on("onGetQuestion", handleGetQuestion);
    sessionSocket.on("onSubmitAnswer", handleOnGetAnswer);
    sessionSocket.on("onGameEnd", handleOnGameEnd);
    sessionSocket.on("onResetGame", handleOnResetGame);

    return () => {
      sessionSocket.off("onGetQuestion", handleGetQuestion);
      sessionSocket.off("onSubmitAnswer", handleOnGetAnswer);
      sessionSocket.off("onGameEnd", handleOnGameEnd);
      sessionSocket.off("onResetGame", handleOnResetGame);
    };
  }, []);

  return (
    <>
      <AnswerOverlay
        isCorrect={isCorrect}
        score={score}
        questionId={answerQuestionId}
        isShow={showAnswerOverlay}
      />
      <Grid item xs={12} display="flex" justifyContent="center">
        {isDesktop || endCountdownActive ? (
          questionName !== "" && (
            <>
              <Box
                boxShadow={8}
                backgroundColor={"#817BAD"}
                p={6}
                overflow="hidden"
                position="absolute"
                top={0}
                sx={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
              >
                <Typography
                  color={"white"}
                  variant="h4"
                  textAlign={"center"}
                  mb={3}
                >
                  {questionName}
                </Typography>
              </Box>
              {countdownActive && (
                <Typography
                  color={"white"}
                  variant="h5"
                  textAlign={"center"}
                  mb={2}
                >
                  Ready ...?
                </Typography>
              )}
            </>
          )
        ) : (
          <Typography
            color={"white"}
            variant="h4"
            textAlign={"center"}
            mt={5}
            mb={3}
          >
            {questionName}
          </Typography>
        )}
      </Grid>
      {showPodium ? (
        <Grid
          container
          display="flex"
          justifyContent="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Typography
              color={"white"}
              variant="h4"
              textAlign={"center"}
              mt={3}
            >
              Goofy Song Trivia !<br />
              -- Podium --
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            mt={1}
            mb={-3}
          >
            <CountdownTimer
              initialSeconds={15}
              onComplete={handlePodiumCountdown}
              startCountdown={showPodium}
              isInverted={false}
            />
          </Grid>
          <Grid item xs={12}>
            <Podium topPlayers={resultTopPlayers} players={resultPlayers} />
          </Grid>
        </Grid>
      ) : (
        !endCountdownActive && (
          <Grid
            item
            xs={12}
            minHeight={80}
            mb={5}
            sx={
              !isDesktop
                ? { position: "fixed", top: 20, left: 0, right: 0 }
                : {}
            }
          >
            <PlayerListThree playersList={playersList} isPlaying={true} />
          </Grid>
        )
      )}
      {/* preQuestionTimer */}
      {!isDesktop && countdownActive && (
        <Typography color={"white"} variant="h6" textAlign={"center"} mb={1}>
          Ready ??
        </Typography>
      )}
      {endCountdownActive && (
        <Grid item xs={12} display="flex" justifyContent="center">
          <CountdownTimer
            initialSeconds={5}
            onComplete={handleEndCountdown}
            startCountdown={endCountdownActive}
            isInverted={true}
          />
        </Grid>
      )}
      {countdownActive && (
        <Grid item xs={12} display="flex" justifyContent="center">
          <CountdownTimer
            initialSeconds={5}
            onComplete={handlePreQuestionCountdownComplete}
            startCountdown={countdownActive}
            isInverted={true}
          />
        </Grid>
      )}
      {/* questionTimer */}
      {questionCountdownActive &&
        !countdownActive &&
        !endCountdownActive &&
        !showPodium && (
          <Grid item xs={12} display="flex" justifyContent="center">
            <CountdownTimer
              initialSeconds={15}
              onComplete={handleQuestionCountdownComplete}
              startCountdown={questionCountdownActive}
              isInverted={false}
              cbTimeRemain={handleQuestionTimeRemain}
            />
          </Grid>
        )}
      {/* choices section */}
      <Grid item xs={12} display="flex" justifyContent="center" mt={2} mb={3}>
        <Box
          sx={
            isDesktop
              ? {
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(2, 1fr)", // Two columns for buttons
                  mb: 3,
                  width: "100%",
                  height: "100%",
                }
              : {
                  display: "grid",
                  gap: "4px",
                  gridTemplateColumns: "repeat(2, 1fr)", // Two columns for buttons
                  mb: 3,
                  maxHeight: "400px",
                  width: "100%",
                  maxWidth: "400px", // Set a maximum width for the box to prevent viewport widening
                }
          }
        >
          {answerOptions.map((option) => (
            <Button
              key={option}
              variant="contained"
              disableRipple={true}
              disabled={countdownActive}
              onClick={() => handleAnswerClick(option)}
              sx={
                isDesktop
                  ? {
                      padding: 2,
                      borderWidth: "4px",
                      borderColor:
                        selectedAnswer === option ? "#a69edc" : "#ffffff",
                      borderStyle: "solid",
                      backgroundColor: "#FFFFFF",
                      color: "#7f5baf",
                      fontSize: isDesktop ? "18px" : "16px",
                      fontWeight: isDesktop ? "800" : "600",
                      textTransform: "none",
                      wordBreak: "break-word", // Allow text to break onto the next line
                      whiteSpace: "normal", // Allow wrapping to a new line
                      textAlign: "center", // Center-align text
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                      },
                    }
                  : {
                      width: "200px",
                      height: "160px",
                      padding: 2,
                      borderWidth: "4px",
                      borderColor:
                        selectedAnswer === option ? "#a69edc" : "#ffffff",
                      borderStyle: "solid",
                      backgroundColor: "#FFFFFF",
                      color: "#7f5baf",
                      fontSize: isDesktop ? "18px" : `16px`,
                      fontWeight: isDesktop ? "800" : "700",
                      textTransform: "none",
                      wordBreak: "break-word", // Allow text to break onto the next line
                      whiteSpace: "normal", // Allow wrapping to a new line
                      textAlign: "center", // Center-align text
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                      },
                    }
              }
            >
              {option}
            </Button>
          ))}
        </Box>
      </Grid>
      {!showPodium && (
        <Box
          position="fixed"
          bottom="20px"
          right="20px"
          display="flex"
          alignItems="center"
          padding={2}
          color="white"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
            backdropFilter: "blur(10px)", // Background blur for glass effect
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle white border
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography color={"white"} variant="h4" textAlign={"center"}>
            {currentQuestionNumber}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Trivia;
