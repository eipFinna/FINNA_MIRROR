import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Link } from '@mui/material';
import loadingGif from './loading.gif';
import { format } from 'date-fns';

const Popup = () => {
  const [text, setText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  useState(() => {
    chrome.storage.local.get("selectedText", function (result) {
      console.log('Value currently is ' + result.selectedText);
      setInputText(result.selectedText);
    });
  }, []);

  async function analyseText() {
    setIsLoading(true);
    const response = await fetch(`http://localhost:3001/search?q=${inputText}`);
    const json = await response.json();
    setText(json[0].Body);
    setLink(json[0].Link);
    setDate(format(json[0].Date, 'dd/MM/yyyy'));
    setIsLoading(false);
  }

  return (
    <Box className="App">
      <Box className="App-header">
        <Typography variant="h4">Finna</Typography>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          flexDirection="column"
          paddingY={4}
          alignItems="center"
          justifyContent="center"
          gap="16px"
        >
          <TextField
            id="outlined-multiline-flexible"
            label="Text à analyser"
            multiline
            maxRows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button size="large" variant="contained" onClick={analyseText}>
            Analyser le texte
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          {isLoading && <img src={loadingGif} width="64px" alt="loading" />}
          <DisplayText text={text} />
          <Box display="flex" flexDirection="row" gap={2}>
            {link !== '' && (
              <Link variant="caption" target="_blank" href={link}>
                voir plus
              </Link>
            )}
            {date !== '' && <Typography variant="caption">{date}</Typography>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function DisplayText({ text }) {
  return (
    <Typography paddingX="16px" variant="body2">
      {text}
    </Typography>
  );
}

export default Popup;
