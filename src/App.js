import React from 'react';
import Calendar from './components/Calendar';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      gradient: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)'
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
      gradient: 'linear-gradient(45deg, #f50057 30%, #ff5983 90%)'
    },
    background: {
      default: '#e8eaf6',
      paper: '#ffffff',
      gradient: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)'
    },
    holiday: {
      main: '#ff9800',
      light: '#ffe0b2',
      gradient: 'linear-gradient(to right, #ff9800, #ff4081)'
    },
    event: {
      main: '#4caf50',
      light: '#e8f5e9',
      gradient: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
    },
    note: {
      main: '#9c27b0',
      light: '#f3e5f5',
      gradient: 'linear-gradient(to right, #ec407a, #ab47bc)'
    },
    today: {
      main: '#2196f3',
      light: '#bbdefb',
      gradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
    },
    weekend: {
      light: '#fff8e1',
      gradient: 'linear-gradient(120deg, #fdfbfb 0%, #fff8e1 100%)'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 2
          },
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(45deg, #f50057 30%, #3f51b5 90%)'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: 16,
          backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#3f51b5'
            }
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '0.05em'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: 3
        }}
      >
        <Calendar />
      </Box>
    </ThemeProvider>
  );
}

export default App;
