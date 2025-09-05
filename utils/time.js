module.exports = {
  getNow: function () {
    const date = new Date();
    const epochTimeInSeconds = Math.floor(Date.now() / 1000);
    return epochTimeInSeconds;
  },
  getHourAgo: function (nowTime) {
    return nowTime - 3600;
  },
  getDayAgo: function (nowTime) {
    return nowTime - 86400;
  },
  getMonthAgo: function (nowTime) {
    return nowTime - 2592000;
  },
};