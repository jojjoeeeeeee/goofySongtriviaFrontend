// src/ShareButton.js
import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';

const ShareButton = ({ sharingUrl }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const isMobileOrTablet = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    // Check for mobile or tablet devices
    return (
      /android/i.test(userAgent) ||
      /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream ||
      /tablet/i.test(userAgent)
    );
  };
  

  const shareOnDiscord = () => {
    const url = sharingUrl; // The link you want to share
    const discordShareUrl = `discord://share?text=${encodeURIComponent(sharingUrl)}`;

    // Attempt to open Discord directly
    window.location.href = discordShareUrl;

    // Optionally, you can also show a success message
    setMessage('If Discord is installed, the app should open.');
    setOpen(true);
  };

  const shareLink = async () => {
    const url = sharingUrl; // The URL to share
    if (navigator.share) {
      await navigator.share({
        title: 'Goofy Song Trivia!',
        text: 'Join with game code!',
        url: url,
      });
      setMessage('Share successful!');
    } else {
      if (isMobileOrTablet) {
        shareOnDiscord();g
      }
      copyToClipboard(url);
      setMessage('Link copied to clipboard!');
    }
    setOpen(true);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    } else {
      // Fallback method for browsers without the Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        setMessage('Error sharing link.');
      }
      document.body.removeChild(textarea);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={shareLink}
        sx={{
            m: "20px",
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            color: "white",
            fontWeight: "bold",
            borderRadius: 8,
            padding: "10px",
            "&:hover": {
              background:
                "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
            },
          }}
      >
        Share game code!
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShareButton;
