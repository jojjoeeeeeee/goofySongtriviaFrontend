import React from 'react';
import { Button } from '@mui/material'
import { endpoint } from '../Config/Constant';

const ConnectSpotifyButton = () => {
    return (
        <Button
            variant='contained'
            size='large'
            href={`${endpoint}/auth/spotify`}
            startIcon={<img width={40} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1200px-Spotify_icon.svg.png"/>}
            sx={{
                color:'white',
                backgroundColor: "#1db954",
                ":hover": {
                    backgroundColor: "#168d40"
                }
            }}
        >
            Connect to Spotify Account
        </Button>
    )
}

export default ConnectSpotifyButton;
