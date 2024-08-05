const hotelinfoQueries = {
  totalRequests: {
    type: 'data',
    query: {
      index: '{{hotelinfoIndex}}',
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
      index: '{{hotelinfoIndex}}',
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
  countryAggregation: {
    type: 'aggregation',
    query: {
      index: '{{hotelinfoIndex}}',
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
          country: {
            terms: {
              field: "country.keyword",
              size: 10 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  sourcenameAggregation: {
    type: 'aggregation',
    query: {
      index: '{{hotelinfoIndex}}',
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
          sourcename: {
            terms: {
              field: "sourcename.keyword",
              size: 10 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  responsetimeHistogram: {
    type: 'histogram',
    query: {
      index: '{{hotelinfoIndex}}',
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
          responsetime_histogram: {
            histogram: {
              field: "responsetimems",
              interval: 100 // Adjust the interval as needed
            }
          }
        }
      }
    }
  },
  errmsgAggregation: {
    type: 'aggregation',
    query: {
      index: '{{hotelinfoIndex}}',
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
              size: 10 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  useridAggregation: {
    type: 'aggregation',
    query: {
      index: '{{hotelinfoIndex}}',
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
              size: 10 // Adjust the size as needed
            }
          }
        }
      }
    }
  }
};

export default hotelinfoQueries;
