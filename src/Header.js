import React from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ startDate, endDate, userid, handleStartDateChange, handleEndDateChange, handleUseridChange, handleRefresh }) => {
  const location = useLocation();
  const activeStyle = { backgroundColor: '#64b5f6', color: 'white' }; // Light blue background for active button

  const handleUseridInput = (event) => {
    const value = event.target.value;
    if (/^\d{0,15}$/.test(value)) {
      handleUseridChange(event);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#90caf9', color: 'black' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={location.pathname === '/' ? activeStyle : {}}
          >
            Loginfo
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/airinfo"
            sx={location.pathname === '/airinfo' ? activeStyle : {}}
          >
            Airinfo
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/hotelinfo"
            sx={location.pathname === '/hotelinfo' ? activeStyle : {}}
          >
            Hotelinfo
          </Button>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            id="start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            sx={{ width: 150, marginRight: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="end-date"
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            sx={{ width: 150, marginRight: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="userid"
            label="User ID"
            type="text"
            value={userid}
            onChange={handleUseridInput}
            sx={{ width: 150, marginRight: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="contained" color="primary" onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
