let sighting = {
  id: "transient:foo",
  observables: [
    {
      value: "42.42.42.42",
      type: "ip",
    },
  ],
  confidence: "Low",
  relations: [
    {
      origin: "string",
      origin_uri: "string",
      relation: "string",
      relation_info: {
        keyword: {
          anything: "anything",
        },
      },
      source: {
        value: "cisco.com",
        type: "hostname",
      },
      related: {
        value: "amp.cisco.com",
        type: "hostname",
      },
    },
  ],
  tlp: "amber",
  internal: true,
  timestamp: "2016-01-01T01:01:01.000Z",
  revision: 1,
  sensor: "string",
  count: 10,
  short_description: "string",
  targets: [
    {
      type: "string",
      observables: [
        {
          value: "cisco.com",
          type: "domain",
        },
      ],
      observed_time: {
        start_time: "2016-01-01T01:01:01.000Z",
        end_time: "2016-01-01T01:01:01.000Z",
      },
      os: "string",
      properties_data_tables: "string",
    },
  ],
  schema_version: "string",
  title: "string",
  source: "string",
  type: "sighting",
  source_uri: "string",
  language: "string",
  external_references: [
    {
      source_name: "string",
      description: "string",
      url: "string",
      hashes: ["string"],
      external_id: "string",
    },
  ],
  severity: "High",
  observed_time: {
    start_time: "2016-01-01T01:01:01.000Z",
    end_time: "2016-01-01T01:01:01.000Z",
  },
  description: "string",
  external_ids: ["string"],
  resolution: "string",
};

module.exports = { sighting };
