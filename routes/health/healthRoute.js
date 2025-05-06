module.exports = (app) => {
  app.post('/health', async (req, res) => {
    res.send({ data: { status: 'ok' } });
  });
};
