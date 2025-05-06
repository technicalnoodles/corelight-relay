let targetRecord = {
  description: "description",
  schema_version: "c/ctim-schema-version",
  revision: 1,
  type: "target-record",
  source: "cisco:ise:dhcp-server",
  external_ids: [
    "http://ex.tld/ctia/target-record/target-record-7d3e0f0c-6ee7-4578-8e1a-f45a750bb37b",
  ],
  targets: [
    {
      type: "endpoint",
      os: "centos linux release 7.5",
      observed_time: {
        start_time: "2020-01-11T00:40:48Z",
        end_time: "2525-01-01T00:00:00Z",
      },
      observables: [
        {
          value: "atl.ciscothreatresponse.local",
          type: "hostname",
        },
        {
          value: "192.168.1.204",
          type: "ip",
        },
        {
          value: "00:50:56:b8:0c:c8",
          type: "mac_address",
        },
      ],
      internal: true,
      source_uri:
        "https://console.amp.cisco.com/computers/5229eaaa-a3f1-4a05-b961-65c8b9a28e96/trajectory?q=192.168.243.112",
      sensor: "process.dhcp-server",
    },
  ],
  short_description: "short description",
  title: "TR-8BA72C1B",
  external_references: [
    {
      source_name: "source",
      external_id: "TR042",
      url: "https://ex.tld/wiki/TR042",
      hashes: ["#section1"],
      description: "Description text",
    },
  ],
  source_uri: "http://example.com/target-record",
  language: "language",
  id:
    "http://ex.tld/ctia/target-record/target-record-7d3e0f0c-6ee7-4578-8e1a-f45a750bb37b",
  tlp: "green",
  timestamp: "2016-02-11T00:40:48Z",
};

module.exports = { targetRecord };
