Application Data Stats

Application Data Stats is a web-based dashboard that provides analytics and insights into different Elasticsearch indices such as loginfo, airinfo, and hotelinfo. This project allows users to visualize data through various charts and tables based on predefined queries.

Key Features

    Date Range Selection: Users can select a start date and end date to filter the data.
    User ID Filtering: Users can filter data based on user IDs.
    Dynamic Data Refresh: Users can refresh data with a button click.
    Visual Representations: Data is displayed in various formats, including bar charts, pie charts, and tables.

Images

[AirInfo](images/data_airinfo.png)<br>
[Loginfo](images/data_loginfo.png)<br>
[Hotelinfo](images/data_hotelinfo.png)

Technologies Used

    Frontend: React, Material-UI, Recharts
    Backend: Node.js, Express
    Database: Elasticsearch

Queries Overview

    Total Requests: Count of all requests within the selected date range.
    Error Requests: Count of error requests based on the status field.
    Histogram Queries: Visualization of request times or response times.
    Aggregations: Aggregations based on fields such as endpoint, role, browser, errmsg, and more.

Project Setup
Prerequisites

    Node.js: Ensure Node.js and npm are installed.
    Elasticsearch: Ensure Elasticsearch is running and accessible.
    Docker: Ensure Docker and Docker Compose are installed.

Installation

    Clone the repository:

    git clone https://github.com/prabhur24/application-data-stats.git
cd application-data-stats

Install dependencies:

npm install

Set up environment variables:

    Create a .env file in the root directory with the following content:

    env

        REACT_APP_ELASTICSEARCH_HOST=your_elasticsearch_host
        REACT_APP_LOGINFO_INDEX=your_loginfo_index
        REACT_APP_AIRINFO_INDEX=your_airinfo_index
        REACT_APP_HOTELINFO_INDEX=your_hotelinfo_index

Running the Application
Development

npm start

Production

    Build the application:

npm run build

Serve the application:

    npm install -g serve
    serve -s build

Switching Between Environments

You can switch between different environments (development, test, production) by changing the environment variables in the .env file. For example:
.env.test

env

REACT_APP_ELASTICSEARCH_HOST=http://test-elasticsearch:9200
REACT_APP_LOGINFO_INDEX=test_loginfo*
REACT_APP_AIRINFO_INDEX=test_airinfo*
REACT_APP_HOTELINFO_INDEX=test_hotelinfo*

.env.prod

env

REACT_APP_ELASTICSEARCH_HOST=http://prod-elasticsearch:9200
REACT_APP_LOGINFO_INDEX=prod_loginfo*
REACT_APP_AIRINFO_INDEX=prod_airinfo*
REACT_APP_HOTELINFO_INDEX=prod_hotelinfo*

To apply the changes, restart your development server or rebuild the application for production.

This README.md provides a comprehensive overview of the project, setup instructions, and details on how to switch between different environments. Feel free to adjust any part to better fit your project's specifics.