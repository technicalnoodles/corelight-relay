const axios = require('axios');
const https = require('https');

module.exports = {
  getDetections: async function (auth, detection) {
    const instance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`
    }
    const response = await instance.post(
      'https://api.investigator.corelight.com/graphql',
      '',
      {
        params: {
          raw: 'true',
        },
        headers: headers
      }
    );

    const token = await response.data;
    return token;
  },
};
