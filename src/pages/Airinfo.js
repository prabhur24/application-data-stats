import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import config from '../config';
import airinfoQueries from '../queries/airinfoQueries';
import log from '../logger';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A6'];

const Airinfo = ({ startDate, endDate, userid, refreshKey, setIsRequestInProgress }) => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [errorRequests, setErrorRequests] = useState(0);
  const [analyticstypeAggregation, setAnalyticstypeAggregation] = useState([]);
  const [airtypeAggregation, setAirtypeAggregation] = useState([]);
  const [airtypeSearchtypeAggregation, setAirtypeSearchtypeAggregation] = useState([]);
  const [cabinclassAggregation, setCabinclassAggregation] = useState([]);
  const [sourcenameAggregation, setSourcenameAggregation] = useState([]);
  const [searchtimeHistogram, setSearchtimeHistogram] = useState([]);
  const [errmsgAggregation, setErrmsgAggregation] = useState([]);
  const [useridAggregation, setUseridAggregation] = useState([]);
  const [sourcenameSlowSearchAggregation, setSourcenameSlowSearchAggregation] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const executeQuery = async (queryTemplate) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

    try {
      const query = JSON.parse(
        JSON.stringify(queryTemplate.query)
          .replace('{{startDate}}', startDate)
          .replace('{{endDate}}', endDate)
          .replace('{{airinfoIndex}}', config.airinfoIndex)
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

    const totalRequestsQuery = airinfoQueries.totalRequests;
    const errorRequestsQuery = airinfoQueries.errorRequests;
    const analyticstypeAggregationQuery = airinfoQueries.analyticstypeAggregation;
    const airtypeAggregationQuery = airinfoQueries.airtypeAggregation;
    const airtypeSearchtypeAggregationQuery = airinfoQueries.airtypeSearchtypeAggregation;
    const cabinclassAggregationQuery = airinfoQueries.cabinclassAggregation;
    const sourcenameAggregationQuery = airinfoQueries.sourcenameAggregation;
    const searchtimeHistogramQuery = airinfoQueries.searchtimeHistogram;
    const errmsgAggregationQuery = airinfoQueries.errmsgAggregation;
    const useridAggregationQuery = airinfoQueries.useridAggregation;
    const sourcenameSlowSearchAggregationQuery = airinfoQueries.sourcenameSlowSearchAggregation;

    const totalRequestsResult = await executeQuery(totalRequestsQuery);
    const errorRequestsResult = await executeQuery(errorRequestsQuery);
    const analyticstypeAggregationResult = await executeQuery(analyticstypeAggregationQuery);
    const airtypeAggregationResult = await executeQuery(airtypeAggregationQuery);
    const airtypeSearchtypeAggregationResult = await executeQuery(airtypeSearchtypeAggregationQuery);
    const cabinclassAggregationResult = await executeQuery(cabinclassAggregationQuery);
    const sourcenameAggregationResult = await executeQuery(sourcenameAggregationQuery);
    const searchtimeHistogramResult = await executeQuery(searchtimeHistogramQuery);
    const errmsgAggregationResult = await executeQuery(errmsgAggregationQuery);
    const useridAggregationResult = await executeQuery(useridAggregationQuery);
    const sourcenameSlowSearchAggregationResult = await executeQuery(sourcenameSlowSearchAggregationQuery);

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

    if (analyticstypeAggregationResult && analyticstypeAggregationResult.aggregations) {
      setAnalyticstypeAggregation(analyticstypeAggregationResult.aggregations.analyticstype.buckets);
    }

    if (airtypeAggregationResult && airtypeAggregationResult.aggregations) {
      setAirtypeAggregation(airtypeAggregationResult.aggregations.airtype.buckets);
    }

    if (airtypeSearchtypeAggregationResult && airtypeSearchtypeAggregationResult.aggregations) {
      setAirtypeSearchtypeAggregation(airtypeSearchtypeAggregationResult.aggregations.airtype.buckets);
    }

    if (cabinclassAggregationResult && cabinclassAggregationResult.aggregations) {
      setCabinclassAggregation(cabinclassAggregationResult.aggregations.cabinclass.buckets);
    }

    if (sourcenameAggregationResult && sourcenameAggregationResult.aggregations) {
      setSourcenameAggregation(sourcenameAggregationResult.aggregations.sourcename.buckets);
    }

    if (searchtimeHistogramResult && searchtimeHistogramResult.aggregations) {
      setSearchtimeHistogram(searchtimeHistogramResult.aggregations.searchtime_histogram.buckets);
    }

    if (errmsgAggregationResult && errmsgAggregationResult.aggregations) {
      setErrmsgAggregation(errmsgAggregationResult.aggregations.errorMessages.buckets);
    }

    if (useridAggregationResult && useridAggregationResult.aggregations) {
      setUseridAggregation(useridAggregationResult.aggregations.userids.buckets);
    }

    if (sourcenameSlowSearchAggregationResult && sourcenameSlowSearchAggregationResult.aggregations) {
      setSourcenameSlowSearchAggregation(sourcenameSlowSearchAggregationResult.aggregations.sourcename.buckets);
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Analyticstype Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 250 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Analyticstype</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticstypeAggregation.map((bucket) => (
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Airtype Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 250 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Airtype</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {airtypeAggregation.map((bucket) => (
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Airtype and Searchtype Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 250 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Airtype</TableCell>
                    <TableCell align="right">Searchtype</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {airtypeSearchtypeAggregation.map((bucket) => (
                    bucket.searchtype.buckets.map((subBucket) => (
                      <TableRow key={`${bucket.key}-${subBucket.key}`}>
                        <TableCell component="th" scope="row">
                          {bucket.key}
                        </TableCell>
                        <TableCell align="right">{subBucket.key}</TableCell>
                        <TableCell align="right">{subBucket.doc_count}</TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Cabinclass Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 250 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Cabinclass</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cabinclassAggregation.map((bucket) => (
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Sourcename Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 250 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Sourcename</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sourcenameAggregation.map((bucket) => (
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Search Time Histogram</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={searchtimeHistogram}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="doc_count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2, height: 450, overflow: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Sourcename with Slow Search Aggregation</Typography>
            <TableContainer component={Box} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Sourcename</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sourcenameSlowSearchAggregation.map((bucket) => (
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
      </Grid>
    </Box>
  );
};

export default Airinfo;
