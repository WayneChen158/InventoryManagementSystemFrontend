import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='fixed'>
      <Container maxWidth='xl'>
          <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                  <NavText href='/' text='GOURMET EXPLORER' isMain />
                  <NavText href='/city' text='CITIES' />
                  <NavText href='/reviewers' text='TRENDING REVIEWERS' />
                  <NavText href='/top_restaurants' text='TRENDING RESTAURANTS' />
              </div>
          </Toolbar>
      </Container>
    </AppBar>
  );
}
