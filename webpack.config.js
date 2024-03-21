const path = require('path');

module.exports = {
  // ... Các cấu hình khác của webpack
  "resolve": {
    "fallback": {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  }
  // ... Các cấu hình khác của webpack
};