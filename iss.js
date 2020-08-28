const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ipAddress = JSON.parse(body);
    callback(null, ipAddress);
  });
};

module.exports = { fetchMyIP };