import React, { useEffect } from 'react';
import './Popup.css';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Link } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import loadingGif from './loading.gif';
import { format } from 'date-fns';

function StyledButton({ width, children, ...props }) {
  return (
    <Button
      size="large"
      variant="contained"
      
      sx={{
        width: width,
        display: 'inline-flex', // Ensure correct display
        backgroundColor: '#0057D9',
        color: '#ffff',
        fontSize: '14px',
        '&:hover': {
          backgroundColor: '#0046b3',
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

const Popup = () => {
  const [text, setText] = useState('test');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tmpText, setTmpText] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [articleLength, setArticleLength] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(['tmpText', 'selectedText'], (result) => {
      const { tmpText, selectedText } = result;
      if (selectedText && selectedText !== tmpText) {
        setInputText(selectedText);
        chrome.storage.local.set({ tmpText: selectedText });
      } else if (selectedText) {
        setInputText(selectedText);
      } else {
        setInputText('');
      }
    });
  }, []);


  async function analyseText() {
    setIsLoading(true);
    const response = await fetch(`http://localhost:3001/search?q=${inputText}`);
    const json = await response.json();
    console.log(json);
    console.log(json.summary);
    setText(json.summary);
    setLink(json.articles[0].url);
    setDate(format(json.articles[0].date, 'dd/MM/yyyy'))
    setArticleLength(json.articles.length);
    setIsLoading(false);
  }

  return (
    <Box className="App">
      <Box className="App-header">
        <Typography variant="h5">Finna</Typography>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          flexDirection="column"
          paddingY={4}
          alignItems="center"
          justifyContent="center"
          gap="16px"
          width="100%"
        >
          <TextField
            id="outlined-multiline-flexible"
            label="Text à analyser"
            multiline
            maxRows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ width: '90%', backgroundColor: 'white' }}
          />
          <StyledButton width="90%" onClick={analyseText}>
            Vérifier
          </StyledButton>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          {isLoading && <img src={loadingGif} width="64px" alt="loading" />}
          {text &&
          <Box
            display={'flex'}
            flexDirection={'column'}
            bgcolor={'#ffff'}
            borderRadius={2}
            alignItems={'left'}
            textAlign={'left'}
            padding={2}
            gap={2}
            width="90%"
            alignContent={'left'}
            sx={{
              outline: '2px solid #E2E8F0',
              outlineOffset: '-2px',
            }}
          >
            <Box>
              <Typography variant='h6'>Résumé</Typography>
              <DisplayText text={text} />
              <DisplayText text={`${articleLength} sources trouvées`} />
            </Box>
              <Box display="flex" justifyContent="center">
                <StyledButton width="50%" endIcon={<EastIcon />} onClick={analyseText}>
                  Voir les sources
                </StyledButton>
              </Box>
          </Box>}
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
    <Typography variant="body2">
      {text}
    </Typography>
  );
}

export default Popup;
