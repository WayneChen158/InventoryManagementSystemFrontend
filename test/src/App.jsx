import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { blue, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";


import NavBar from './components/header/NavBar';
import Sidebar from './components/sidebar/Sidebar.js';


// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
      contrastText: '#333',
    },
    secondary:{
      light: '#0089f7',
      main: '#1BB1BC',
      contrastText: '#fff',
    },
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Sidebar />
      </BrowserRouter>
    </ThemeProvider>
  );
}