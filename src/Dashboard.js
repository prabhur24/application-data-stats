import React, { useState } from 'react';
import { TextField, Box, Container, Grid, Paper } from '@mui/material';

const Dashboard = () => {
  const [date, setDate] = useState('');

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <TextField
          id="date"
          label="Select Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
            <Box sx={{ height: '300px' }}> {/* Adjust the height as needed */}
              <h3>Main Index 1</h3>
              {/* Placeholder for future content */}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
            <Box sx={{ height: '300px' }}> {/* Adjust the height as needed */}
              <h3>Main Index 2</h3>
              {/* Placeholder for future content */}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
            <Box sx={{ height: '300px' }}> {/* Adjust the height as needed */}
              <h3>Main Index 3</h3>
              {/* Placeholder for future content */}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
            <Box sx={{ height: '300px' }}> {/* Adjust the height as needed */}
              <h3>Main Index 4</h3>
              {/* Placeholder for future content */}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
