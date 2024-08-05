const airinfoQueries = {
  totalRequests: {
    type: 'data',
    query: {
      index: '{{airinfoIndex}}',
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
      index: '{{airinfoIndex}}',
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
  analyticstypeAggregation: {
    type: 'aggregation',
    query: {
      index: '{{airinfoIndex}}',
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
          analyticstype: {
            terms: {
              field: "analyticstype.keyword",
              size: 10 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  airtypeAggregation: {
    type: 'aggregation',
    query: {
      index: '{{airinfoIndex}}',
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
          airtype: {
            terms: {
              field: "airtype.keyword",
              size: 10 // Adjust the size as needed
            }
          }
        }
      }
    }
  },
  airtypeSearchtypeAggregation: {
    type: 'aggregation',
    query: {
      index: '{{airinfoIndex}}',
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
          airtype: {
            terms: {
              field: "airtype.keyword",
              size: 10 // Adjust the size as needed
            },
            aggs: {
              searchtype: {
                terms: {
                  field: "searchtype.keyword",
                  size: 10 // Adjust the size as needed
                }
              }
            }
          }
        }
      }
    }
  },
  cabinclassAggregation: {
    type: 'aggregation',
    query: {
      index: '{{airinfoIndex}}',
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
          cabinclass: {
            terms: {
              field: "cabinclass.keyword",
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
      index: '{{airinfoIndex}}',
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
  searchtimeHistogram: {
    type: 'histogram',
    query: {
      index: '{{airinfoIndex}}',
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
          searchtime_histogram: {
            histogram: {
              field: "searchtimeinsec",
              interval: 1 // Adjust the interval as needed
            }
          }
        }
      }
    }
  },
  errmsgAggregation: {
    type: 'aggregation',
    query: {
      index: '{{airinfoIndex}}',
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
      index: '{{airinfoIndex}}',
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
  },
  sourcenameSlowSearchAggregation: {
    type: 'aggregation',
    query: {
      index: '{{airinfoIndex}}',
      body: {
        query: {
          bool: {
            must: [
              { range: { "@timestamp": { gte: "{{startDate}}T00:00:00", lte: "{{endDate}}T23:59:59" } } },
              { range: { "searchtimeinsec": { gt: 5 } } }
            ]
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
  }
};

export default airinfoQueries;
