let verdict = {
  type: "verdict",
  disposition: 2,
  observable: {
    value: "cisco.com",
    type: "domain",
  },
  judgement_id: "foo-12345",
  disposition_name: "Malicious",
  valid_time: {
    start_time: "2010-01-01T01:01:01.000Z",
    end_time: "2020-01-01T01:01:01.000Z",
  },
};

module.exports = { verdict };
