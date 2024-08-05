let config;

if (process.env.NODE_ENV === 'production') {
  config = require('./config.prod').default;
} else if (process.env.NODE_ENV === 'test') {
  config = require('./config.test').default;
} else {
  config = require('./config.dev').default; // Fallback to development config if available
}

export default config;

