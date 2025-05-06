let tile = {
  id: "security_alert_summary_24h",
  type: "metric_group",
  title: "Umbrella Security Alert Summary for the last 24H",
  short_description:
    "A set of metrics summarizing security alert activity in your Umbrella Organization during the last 24 hours",
  description:
    "A set of metrics summarizing security alert activity in your Umbrella Organization...",
  periods: [
    "last_hour",
    "last_24_hours",
    "last_7_days",
    "last_30_days",
    "last_60_days",
    "last_90_days",
  ],
  tags: ["umbrella", "alerts"],
};

let tileData = {
  observed_time: {
    start_time: "2016-02-11T00:40:48.212-00:00",
    end_time: "2016-02-11T00:40:48.212-00:00",
  },
  valid_time: {
    start_time: "2016-02-11T00:40:48.212-00:00",
    end_time: "2016-02-11T00:40:48.212-00:00",
  },
  cache_scope: "user",
  data: [{ key: 0, value: 2, segments: [{ key: 0, value: 2 }] }],
};

module.exports = { tile, tileData };
