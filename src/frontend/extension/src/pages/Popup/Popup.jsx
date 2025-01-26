import React from 'react';
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
  const [tmpText, setTmpText] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  useState(() => {
    //put the tmpText in a variable
    chrome.storage.local.get("tmpText", function (result) {
      setTmpText(result.tmpText);
    });
    chrome.storage.local.get("selectedText", function (result) {
      if (result.selectedText !== tmpText) {
        console.log(tmpText)
        console.log('Value currently is ' + result.selectedText);
        setInputText(result.selectedText);
        // set the result.selectedText in the local storage tmpText
        chrome.storage.local.set({ "tmpText": result.selectedText }, function () {
          console.log('Value is set to ' + result.selectedText);
        });
      } else {
        setInputText('');
      }
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
