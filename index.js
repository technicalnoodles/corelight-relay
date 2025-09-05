const express = require('express');
const bodyParser = require('body-parser');

// Set port based on environment
const port = process.env.NODE_ENV === 'production' ? 443 : 6000;

const app = express();
app.use(bodyParser.json());

require('./routes/health/healthRoute.js')(app);
require('./routes/refer/referRoute.js')(app);
// require('./routes/tiles/tileRoute.js')(app);
require('./routes/deliberate/deliberateRoute.js')(app);


app.listen(port, () => {
  console.log(`Server running on port ${port} (${process.env.NODE_ENV || 'development'} mode)`);
});
