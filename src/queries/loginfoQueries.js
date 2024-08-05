const loginfoQueries = {
  totalRequests: {
    type: 'data',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: "{{startDate}}T00:00:00",
              lte: "{{endDate}}T23:59:59"
            }
          }
        }
      }
    }
  },
  errorRequests: {
    type: 'data',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          bool: {
            must: [
              { range: { "@timestamp": { gte: "{{startDate}}T00:00:00", lte: "{{endDate}}T23:59:59" } } },
              { term: { "status": "error" } }
            ]
          }
        }
      }
    }
  },
  timeInMillisHistogram: {
    type: 'histogram',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: "{{startDate}}T00:00:00",
              lte: "{{endDate}}T23:59:59"
            }
          }
        },
        aggs: {
          timeinmillsec_histogram: {
            histogram: {
              field: "timeinmillsec",
              interval: 1000 // Adjust the interval as needed
            }
          }
        }
      }
    }
  },
  endpointAggregation: {
    type: 'aggregation',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: "{{startDate}}T00:00:00",
              lte: "{{endDate}}T23:59:59"
            }
          }
        },
        aggs: {
          endpoints: {
            terms: {
              field: "endpoint.keyword",
              size: 40 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  roleAggregation: {
    type: 'aggregation',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: "{{startDate}}T00:00:00",
              lte: "{{endDate}}T23:59:59"
            }
          }
        },
        aggs: {
          roles: {
            terms: {
              field: "role.keyword",
              size: 8 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  browserAggregation: {
    type: 'aggregation',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: "{{startDate}}T00:00:00",
              lte: "{{endDate}}T23:59:59"
            }
          }
        },
        aggs: {
          browsers: {
            terms: {
              field: "browser.keyword",
              size: 5 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  errmsgAggregation: {
    type: 'aggregation',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: "{{startDate}}T00:00:00",
              lte: "{{endDate}}T23:59:59"
            }
          }
        },
        aggs: {
          errorMessages: {
            terms: {
              field: "errmsg.keyword",
              size: 15 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  useridAggregation: {
    type: 'aggregation',
    query: {
      index: '{{loginfoIndex}}',
      body: {
        query: {
          range: {
            "@timestamp": {
              gte: "{{startDate}}T00:00:00",
              lte: "{{endDate}}T23:59:59"
            }
          }
        },
        aggs: {
          userids: {
            terms: {
              field: "userid.keyword",
              size: 15 // Adjust the size as needed
            }
          }
        }
      }
    }
  }
};

export default loginfoQueries;
