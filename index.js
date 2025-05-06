const express = require('express');
const port = 5000;
let { verdict } = require('./samples/verdictSample');
let { tile, tileData } = require('./samples/tileSample');
let {
  assetsResolve,
  assetsResolveLatest,
  assetsDescribe,
  assetsLocate,
} = require('./samples/assetsSample');
let { targetRecord } = require('./samples/targetRecordSample');

const app = express();

require('./routes/health/healthRoute.js')(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
