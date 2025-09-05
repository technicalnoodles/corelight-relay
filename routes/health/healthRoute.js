const axios = require('axios');
const { validateJWTMiddleware } = require('../../utils/middlewares.js');

module.exports = (app) => {
  app.post('/health', validateJWTMiddleware, async (req, res) => {
    // Authentication data is now available in req.authentication
    const response = await axios.post(
      `${req.authentication.corelight_host}/graphql`,
      {
        'query': 'query { alerts(offset: 0, size: 1) { alerts { alert_id score } } }'
      },
      {
        headers: {
          'Authorization': req.authentication.token,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.status !== 200) {
      res.status(500).send({ data: { status: 'error' } });
    }
    res.send({ data: { status: 'ok' } });
  });
  app.post('/aws/health', async (req, res) => {
    res.send({ data: { status: 'ok' } });
  })
};
