const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
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

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching fly over times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const times = JSON.parse(body).response;
    callback(null, times);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("issues getting ip: ", error);
      return;
    }
    fetchCoordsByIP(ip.ip, (error, coords) => {
      if (error) {
        console.log('issues getting coords: ', error);
        return;
      }
      fetchISSFlyOverTimes(coords, (error, times) => {
        if (error) {
          console.log('issues getting fly times: ', error);
          return;
        } 
        callback(null, times);
      })
    })
  })
};

module.exports = { 
  fetchMyIP, 
  fetchCoordsByIP, 
  fetchISSFlyOverTimes, 
  nextISSTimesForMyLocation 
};