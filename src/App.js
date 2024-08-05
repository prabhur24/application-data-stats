import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, TextField, Button } from '@mui/material';
import Loginfo from './pages/Loginfo';
import Airinfo from './pages/Airinfo';
import Hotelinfo from './pages/Hotelinfo';
import config from './config';

const App = () => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [userid, setUserid] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleUseridChange = (event) => {
    setUserid(event.target.value);
  };

  const handleRefresh = () => {
    if (!isRequestInProgress) {
      setRefreshKey((oldKey) => oldKey + 1);
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Loginfo</Link>
            <Link to="/airinfo" style={{ textDecoration: 'none', color: 'white', marginLeft: 20 }}>Airinfo</Link>
            <Link to="/hotelinfo" style={{ textDecoration: 'none', color: 'white', marginLeft: 20 }}>Hotelinfo</Link>
          </Typography>
          <Box>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              sx={{ marginRight: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              sx={{ marginRight: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="text"
              label="User ID"
              value={userid}
              onChange={handleUseridChange}
              sx={{ marginRight: 2 }}
              inputProps={{ maxLength: 15 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefresh}
              disabled={isRequestInProgress}
            >
              Refresh
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        <Routes>
          <Route
            path="/"
            element={<Loginfo startDate={startDate} endDate={endDate} userid={userid} refreshKey={refreshKey} setIsRequestInProgress={setIsRequestInProgress} />}
          />
          <Route path="/airinfo" element={<Airinfo startDate={startDate} endDate={endDate} userid={userid} refreshKey={refreshKey} setIsRequestInProgress={setIsRequestInProgress} />} />
          <Route path="/hotelinfo" element={<Hotelinfo startDate={startDate} endDate={endDate} userid={userid} refreshKey={refreshKey} setIsRequestInProgress={setIsRequestInProgress} />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
