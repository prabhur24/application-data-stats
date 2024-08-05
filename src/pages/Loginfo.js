import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import config from '../config';
import loginfoQueries from '../queries/loginfoQueries';
import log from '../logger';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A6'];

const Loginfo = ({ startDate, endDate, userid, refreshKey, setIsRequestInProgress }) => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [errorRequests, setErrorRequests] = useState(0);
  const [timeInMillisHistogram, setTimeInMillisHistogram] = useState([]);
  const [endpointAggregation, setEndpointAggregation] = useState([]);
  const [roleAggregation, setRoleAggregation] = useState([]);
  const [browserAggregation, setBrowserAggregation] = useState([]);
  const [errmsgAggregation, setErrmsgAggregation] = useState([]);
  const [useridAggregation, setUseridAggregation] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const executeQuery = async (queryTemplate) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

    try {
      const query = JSON.parse(
        JSON.stringify(queryTemplate.query)
          .replace('{{startDate}}', startDate)
          .replace('{{endDate}}', endDate)
          .replace('{{loginfoIndex}}', config.loginfoIndex)
      );

      if (userid) {
        if (query.body.query.bool) {
          query.body.query.bool.must.push({ term: { "userid": userid } });
        } else if (query.body.query.range) {
          query.body.query = {
            bool: {
              must: [
                query.body.query,
                { term: { "userid": userid } }
              ]
            }
          };
        }
      }

      const endpoint = queryTemplate.type === 'data' ? '_count' : '_search';
      const url = `${config.elasticsearchHost}/${query.index}/${endpoint}`;

      console.log('Executing query:', JSON.stringify(query, null, 2)); // Log the query being executed
      console.log('Request URL:', url); // Log the request URL

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query.body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      console.log('Query result:', result); // Log the result
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        setFetchError('Request timed out');
      } else {
        setFetchError(error.message);
      }
      log.error('Error executing query', error);
      return null;
    }
  };

  const fetchData = async () => {
    setIsRequestInProgress(true);

    const totalRequestsQuery = loginfoQueries.totalRequests;
    const errorRequestsQuery = loginfoQueries.errorRequests;
    const timeInMillisHistogramQuery = loginfoQueries.timeInMillisHistogram;
    const endpointAggregationQuery = loginfoQueries.endpointAggregation;
    const roleAggregationQuery = loginfoQueries.roleAggregation;
    const browserAggregationQuery = loginfoQueries.browserAggregation;
    const errmsgAggregationQuery = loginfoQueries.errmsgAggregation;
    const useridAggregationQuery = loginfoQueries.useridAggregation;

    const totalRequestsResult = await executeQuery(totalRequestsQuery);
    const errorRequestsResult = await executeQuery(errorRequestsQuery);
    const timeInMillisHistogramResult = await executeQuery(timeInMillisHistogramQuery);
    const endpointAggregationResult = await executeQuery(endpointAggregationQuery);
    const roleAggregationResult = await executeQuery(roleAggregationQuery);
    const browserAggregationResult = await executeQuery(browserAggregationQuery);
    const errmsgAggregationResult = await executeQuery(errmsgAggregationQuery);
    const useridAggregationResult = await executeQuery(useridAggregationQuery);

    console.log('totalRequestsResult:', totalRequestsResult); // Log the response for debugging
    console.log('errorRequestsResult:', errorRequestsResult); // Log the response for debugging

    if (totalRequestsResult && totalRequestsResult.count !== undefined) {
      setTotalRequests(totalRequestsResult.count);
    } else if (totalRequestsResult && totalRequestsResult.hits && totalRequestsResult.hits.total) {
      setTotalRequests(totalRequestsResult.hits.total.value); // Fallback if count not found
    }

    if (errorRequestsResult && errorRequestsResult.hits && errorRequestsResult.hits.total) {
      setErrorRequests(errorRequestsResult.hits.total.value);
    }

    if (timeInMillisHistogramResult && timeInMillisHistogramResult.aggregations) {
      setTimeInMillisHistogram(timeInMillisHistogramResult.aggregations.timeinmillsec_histogram.buckets);
    }

    if (endpointAggregationResult && endpointAggregationResult.aggregations) {
      setEndpointAggregation(endpointAggregationResult.aggregations.endpoints.buckets);
    }

    if (roleAggregationResult && roleAggregationResult.aggregations) {
      setRoleAggregation(roleAggregationResult.aggregations.roles.buckets);
    }

    if (browserAggregationResult && browserAggregationResult.aggregations) {
      setBrowserAggregation(browserAggregationResult.aggregations.browsers.buckets);
    }

    if (errmsgAggregationResult && errmsgAggregationResult.aggregations) {
      setErrmsgAggregation(errmsgAggregationResult.aggregations.errorMessages.buckets);
    }

    if (useridAggregationResult && useridAggregationResult.aggregations) {
      setUseridAggregation(useridAggregationResult.aggregations.userids.buckets);
    }

    setIsRequestInProgress(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {fetchError && (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography color="error">Error: {fetchError}</Typography>
        </Paper>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Total Requests</Typography>
            <Typography variant="h4">{totalRequests}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Error Requests</Typography>
            <Typography variant="h4">{errorRequests}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ padding: 2, height: 300, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Endpoint Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 250 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Endpoint</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {endpointAggregation.map((bucket) => (
                    <TableRow key={bucket.key}>
                      <TableCell component="th" scope="row">
                        {bucket.key}
                      </TableCell>
                      <TableCell align="right">{bucket.doc_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Time in Milliseconds Histogram</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeInMillisHistogram}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="doc_count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Role and Browser Aggregation</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Role Aggregation</Typography>
                <Box sx={{ height: 300, overflow: 'auto' }}>
                  <TableContainer component={Box} sx={{ maxHeight: 250 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Role</TableCell>
                          <TableCell align="right">Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roleAggregation.map((bucket) => (
                          <TableRow key={bucket.key}>
                            <TableCell component="th" scope="row">
                              {bucket.key}
                            </TableCell>
                            <TableCell align="right">{bucket.doc_count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Browser Aggregation</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={browserAggregation}
                      dataKey="doc_count"
                      nameKey="key"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {browserAggregation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2, height: 450, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Error Message Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Error Message</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {errmsgAggregation.map((bucket) => (
                    <TableRow key={bucket.key}>
                      <TableCell component="th" scope="row">
                        {bucket.key}
                      </TableCell>
                      <TableCell align="right">{bucket.doc_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2, height: 450, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>User ID Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {useridAggregation.map((bucket) => (
                    <TableRow key={bucket.key}>
                      <TableCell component="th" scope="row">
                        {`${bucket.key}`}
                      </TableCell>
                      <TableCell align="right">{bucket.doc_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Loginfo;
