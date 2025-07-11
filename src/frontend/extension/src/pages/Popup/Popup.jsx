import React, { useEffect } from 'react';
import './Popup.css';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Link, Drawer, Card, CardContent, CardActions, Divider } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import loadingGif from './loading.gif';
import { format } from 'date-fns';

function StyledButton({ width, children, ...props }) {
  return (
    <Button
      size="large"
      variant="contained"
      sx={{
        width: width,
        display: 'inline-flex',
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
  const [text, setText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [articleLength, setArticleLength] = useState(0);
  const [articles, setArticles] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Load all saved data when the extension opens
useEffect(() => {
  chrome.storage.local.get(
    ['savedText', 'savedInputText', 'savedLink', 'savedDate', 
     'savedArticleLength', 'savedArticles', 'tmpText', 'selectedText'], 
    (result) => {
      // If tmpText exists, use it as the input text
      // if (result.tmpText) {
      //   setInputText(result.tmpText);
      // } 
      // Otherwise, if selectedText exists, use it
      if (result.selectedText) {
        setInputText(result.selectedText);
        // Save it as tmpText so we know it's been seen
        chrome.storage.local.set({ tmpText: result.selectedText });
      }
      // Otherwise, restore from saved input text if it exists
      else if (result.savedInputText) {
        setInputText(result.savedInputText);
      }
      
      // Then restore previous search results if they exist
      if (result.savedText) {
        setText(result.savedText);
        setLink(result.savedLink || '');
        setDate(result.savedDate || '');
        setArticleLength(result.savedArticleLength || 0);
        setArticles(result.savedArticles || []);
      }
    }
  );
}, []);


  const saveResults = (data) => {
    chrome.storage.local.set({
      savedText: data.summary,
      savedInputText: inputText,
      savedLink: data.articles[0].url,
      savedDate: format(new Date(data.articles[0].date), 'dd/MM/yyyy'),
      savedArticleLength: data.articles.length,
      savedArticles: data.articles
    });
  };

async function analyseText() {
  setIsLoading(true);
  try {
    const response = await fetch(`http://localhost:3001/search?q=${inputText}`);
    const json = await response.json();
    console.log(json);
    
    if (!json || !json.summary || !json.articles || json.articles.length === 0) {
      setText('Aucun résultat trouvé.');
      setArticles([]);
      setLink('');
      setDate('');
      setArticleLength(0);
      return;
    }
    setText(json.summary);
    setArticles(json.articles);
    setLink(json.articles[0].url);
    setDate(format(new Date(json.articles[0].date), 'dd/MM/yyyy'));
    setArticleLength(json.articles.length);
    
    saveResults(json);
    
    chrome.storage.local.remove(['tmpText', 'selectedText']);
  } catch (error) {
    console.error('Error fetching results:', error);
  } finally {
    setIsLoading(false);
  }
}

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const clearResults = () => {
    setText('');
    setArticles([]);
    setLink('');
    setDate('');
    setArticleLength(0);
    
    chrome.storage.local.remove([
      'savedText', 'savedInputText', 'savedLink', 
      'savedDate', 'savedArticleLength', 'savedArticles'
    ]);
  };

  return (
    <Box className="App">
      <Box className="App-header">
        <Typography variant="h5">Finna</Typography>
      </Box>
      <Box display="flex" flexDirection="column" paddingBottom={2}>
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
          <Box display="flex" width="90%" gap={2}>
            <StyledButton width="100%" onClick={analyseText}>
              Vérifier
            </StyledButton>
          </Box>
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
              <StyledButton width="50%" endIcon={<EastIcon />} onClick={togglePanel}>
                Voir les sources
              </StyledButton>
            </Box>
          </Box>}
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={isPanelOpen}
        onClose={togglePanel}
        PaperProps={{
          sx: {
            width: '350px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Sources ({articleLength})</Typography>
          <Button 
            onClick={togglePanel}
            sx={{ minWidth: 'auto', p: '4px' }}
          >
            <CloseIcon />
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
          {articles.map((article, index) => (
            <Card 
              key={index} 
              sx={{ 
                mb: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0'
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="h6" fontSize="16px" fontWeight="bold" mb={1}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Source: {article.provider}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {format(new Date(article.date), 'dd/MM/yyyy')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  href={article.url} 
                  target="_blank"
                  endIcon={<OpenInNewIcon />}
                  sx={{ 
                    color: '#0057D9',
                    '&:hover': { backgroundColor: 'rgba(0, 87, 217, 0.05)' }
                  }}
                >
                  Voir l'article
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Drawer>
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