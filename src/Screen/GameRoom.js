import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { endpoint } from "../Config/Constant";
import GameJoin from "../Components/GameJoin";
import { Grid, useMediaQuery } from "@mui/material";
import ScrollableCardContainer from "../Components/ScrollableCardContainer";
import CountdownOverlay from "../Components/ContdownOverlay";
import Trivia from "../Components/Trivia";
import SongListOverlay from "../Components/SongListOverlay";

const GameRoom = ({ accessToken, playersList, roomCode }) => {
  const [playlists, setPlaylists] = useState([]);
  const [countdownActive, setCountdownActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [songList, setSongList] = useState([]);
  const [isShowSongList, setIsShowSongList] = useState(false);
  const audioRef = useRef(null);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const handleCountdownComplete = () => {
    console.log("Countdown has completed!");
    setCountdownActive(false);
    setIsStarted(true);
  };

  const startCountdown = () => {
    setCountdownActive(true);
  };


  const handleLoadAudio = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      audioRef.current.volume = 0;
      audioRef.current.muted = true;
    }
  };

  const handleAutoPlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      audioRef.current.muted = false;
    }
  };

  const handleMuteAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.muted = true;
    }
  };

  const handleOnResetGame = (data) => {
    setIsStarted(false);
    setSongList(data.songList);
    setIsShowSongList(true);
  };

  const handleOnCloseSongList = () => {
    setIsShowSongList(false);
  }

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            console.log("Autoplay success: muted");
          })
          .catch((error) => {
            console.error("Autoplay error:", error);
          });
      }
    };

    document.addEventListener("click", playAudio);
    if (audioRef.current) {
      console.log("load audio");
      audioRef.current.src =
        "https://p.scdn.co/mp3-preview/4be581ce9ba66b2998127d481d1977dc3ca948af?cid=136b45ab12ee44ba8c4ac1799d6af215'";
      audioRef.current.load();
      audioRef.current.muted = true;
    }

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${endpoint}/api/spotify/user`, {
          params: { room_code: roomCode, access_token: accessToken },
        });
        console.log("user id", response.data.id);
        fetchPlaylists();
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`${endpoint}/api/spotify/playlists`, {
          params: { room_code: roomCode, access_token: accessToken },
        });
        const excludePlaylistMinimum = response.data.items.filter(
          (playlist) => {
            return playlist.tracks.total >= 10;
          }
        );
        const playlistData = excludePlaylistMinimum.map((playlist) => {
          return {
            id: playlist.id,
            title: playlist.name,
            image: playlist.images[0].url,
            url: playlist.external_urls.spotify,
          };
        });
        setPlaylists(playlistData);
      } catch (error) {
        console.error("Error fetching playlists", error);
      }
    };

    fetchUser();
  }, [accessToken]);

  return (
    <>
      <SongListOverlay songList={songList} isOpen={isShowSongList} cbOnCloseSongList={handleOnCloseSongList} />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          backgroundColor: isStarted ? "#635E85" : "#3f3f3f",
        }}
      >
        {isStarted ? (
          <Grid item xs={12} px={isDesktop ? 30 : 0} py={0} mt={2} width="100%">
            <Trivia
              playersList={playersList}
              cbOnAutoPlay={handleAutoPlay}
              cbOnLoadAudio={handleLoadAudio}
              cbOnMuteAudio={handleMuteAudio}
              cbOnResetGame={handleOnResetGame}
              roomCode={roomCode}
            />
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            px={isDesktop ? 30 : 5}
            py={isDesktop ? 10 : 5}
            mt={3}
            sx={{
              maxWidth: "100vw !important",
            }}
          >
            <GameJoin
              playersList={playersList}
              cbHandleOnStart={startCountdown}
              roomCode={roomCode}
            />
          </Grid>
        )}
        {!isStarted && (
          <Grid
            item
            xs={12}
            borderRadius={4}
            boxShadow={15}
            backgroundColor={"#635E85"}
            py={3}
            mx={isDesktop ? 4 : 4}
            mt={0}
            mb={3}
            width={isDesktop ? "40%" : "80%"}
          >
            <ScrollableCardContainer
              cardData={playlists}
              roomCode={roomCode}
            />
          </Grid>
        )}
        <audio ref={audioRef} controls={false} type="audio/mpeg"></audio>
        <CountdownOverlay
          initialSeconds={10}
          onComplete={handleCountdownComplete}
          startCountdown={countdownActive}
        />
      </Grid>
    </>
  );
};

export default GameRoom;
