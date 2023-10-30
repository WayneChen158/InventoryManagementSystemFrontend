import React, { useState, useEffect } from 'react';
import { Drawer, List, Typography, Switch, ListItem, ListItemText, ListItemSecondaryAction, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Autocomplete from '@mui/material/Autocomplete';

const config = require('../config.json');

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop: '63px', // Add marginTop to account for the app bar height
  },
  toolbar: theme.mixins.toolbar,
  quote: {
    fontStyle: 'italic',
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(15),
    fontFamily: 'cursive, serif', // Specify the font family
    fontWeight: 500, // Specify the font weight
    fontSize: '1.2rem', // Specify the font size
    color: '#555', // Specify the font color
  },
}));

const Sidebar = ({ onSelectedCity, onSelectedCuisine, onRestaurantLocationsToggle, onCuisineTypeLocationsToggle, onMostPopularRestaurantsToggle }) => {
  const [selectedCity, setSelectedCity] = useState({ city: 'Alton', state: 'IL' });
  const [cities, setCities] = useState([]);
  const [selectedCuisineType, setSelectedCuisineType] = useState({categories: 'American (New)'});
  const [cuisineTypes, setCuisineTypes] = useState([]);

  useEffect(() => {
    const cityURL = `http://${config.server_host}:${config.server_port}/all_cities`;
    fetch(cityURL)
      .then(res => res.json())
      .then(resData => setCities(resData));
    
    const cuisineURL = `http://${config.server_host}:${config.server_port}/cuisinetypes_by_city/?&city=${selectedCity.city}&state=${selectedCity.state}`;
    fetch(cuisineURL)
    .then(res => res.json())
    .then(resData => setCuisineTypes(resData));
  }, []);

  const classes = useStyles();

  const [showRestaurantLocations, setShowRestaurantLocations] = useState(true);
  const [showCuisineTypeLocations, setShowCuisineTypeLocations] = useState(true);
  const [showMostPopularRestaurants, setShowMostPopularRestaurants] = useState(true);

  const handleRestaurantLocationsToggle = () => {
    setShowRestaurantLocations(!showRestaurantLocations);
    onRestaurantLocationsToggle(!showRestaurantLocations);
  };

  const handleCuisineTypeLocationsToggle = () => {
    setShowCuisineTypeLocations(!showCuisineTypeLocations);
    onCuisineTypeLocationsToggle(!showCuisineTypeLocations);
  };

  const handleMostPopularRestaurantsToggle = () => {
    setShowMostPopularRestaurants(!showMostPopularRestaurants);
    onMostPopularRestaurantsToggle(!showMostPopularRestaurants);
  };

  const handleCityChange = (event, newValue) => {
    setSelectedCity(newValue);
    onSelectedCity(newValue); // Call the callback function with the selected city
  };

  const handleCuisineChange = (event, newValue) => {
    setSelectedCuisineType(newValue);
    onSelectedCuisine(newValue); // Call the callback function with the selected city
  };

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem>
            <Autocomplete
              options={cities}
              getOptionLabel={(city) => `${city.city}, ${city.state}`}
              value={selectedCity}
              onChange={handleCityChange}
              renderInput={params => (
                <TextField {...params}
                  label="Type the desired city"
                  variant="outlined"
                  sx={{ width: 360 }}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.city === value.city && option.state === value.state
              }
            />
          </ListItem>
          <ListItem>
            <Autocomplete
              options={cuisineTypes}
              getOptionLabel={(cuisine) => `${cuisine.categories}`}
              value={selectedCuisineType}
              onChange={handleCuisineChange}
              renderInput={params => (
                <TextField {...params}
                  label="Type the desired cuisine type"
                  variant="outlined"
                  sx={{ width: 360 }}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.city === value.city && option.state === value.state
              }
            />
          </ListItem>

          
          <ListItem>
            <ListItemText primary={
              <Typography variant="h6">
                Top 5 Restaurants by Star Ratings
              </Typography>
            } />
            <ListItemSecondaryAction>
              <Switch
                checked={showRestaurantLocations}
                onChange={handleRestaurantLocationsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary={
              <Typography variant="h6">
                Top 5 Restaurants by Cuisine
              </Typography>
            } />
            <ListItemSecondaryAction>
              <Switch
                checked={showCuisineTypeLocations}
                onChange={handleCuisineTypeLocationsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary={
              <Typography variant="h6">
                Top 5 Restaurants by Popularity
              </Typography>
            } />
            <ListItemSecondaryAction>
              <Switch
                checked={showMostPopularRestaurants}
                onChange={handleMostPopularRestaurantsToggle}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Typography variant="body1" className={classes.quote}>
            "Food is not just about sustenance; it's an expression of art, culture, and love that brings people together."
          </Typography>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
