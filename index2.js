const { nextISSTimesForMyLocation } = require('./iss_promised');

const logTimes = (passTimes) => {
  for (const times of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(times.risetime);
    const duration = times.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
}

nextISSTimesForMyLocation()
  .then((passTimes) => {
    logTimes(passTimes);
  })
  .catch((error) => {
    console.log("it didn't work: ", error);
  });