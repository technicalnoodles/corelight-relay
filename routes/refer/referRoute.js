const axios = require('axios');
const timeFunctions = require('../../utils/time.js');
const authFunctions = require('../../utils/auth.js');
const { validateJWTMiddleware } = require('../../utils/middlewares.js');

const observableLoop = async (observableArray) => {
    let returnData = [];
    for (const observable of observableArray) {
      if (observable.type === 'domain') {
        console.log(`Processing Domain: ${observable.value}`);
          await returnData.push({
            id: `ref-corelight-search-domain-${observable.value}`,
            title: 'Corelight Incident Domain Search',
            description: 'Lookup this Domain on Corelight',
            url: `https://investigator.corelight.com/detections?sort_by=latest_start_timestamp.desc&view=table&source_name=${observable.value}`,
          });
          console.log(returnData);
        }
        if (observable.type === 'ip') {
          console.log(`Processing IP: ${observable.value}`);
          await returnData.push({
            id: `ref-corelight-search-ip-${observable.value}`,
            title: 'Corelight Incident IP Search',
            description: 'Lookup this IP on Corelight',
            url: `https://investigator.corelight.com/detections?sort_by=latest_start_timestamp.desc&view=table&source_name=${observable.value}`,
          });
          console.log(returnData);
        }
      }
    return returnData;
  };

  module.exports = (app) => {
    app.post('/refer/observables', validateJWTMiddleware, async (req, res) => {
      // Authentication data is now available in req.authentication
      const observables = req.body;
      const returnData = await observableLoop(observables);
      res.send({ data: returnData }); 
    });
  };
  