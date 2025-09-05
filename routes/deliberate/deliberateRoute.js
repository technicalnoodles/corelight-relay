const axios = require('axios');
const timeFunctions = require('../../utils/time.js');
const authFunctions = require('../../utils/auth.js');
const queryFunctions = require('../../utils/query.js');
const { response } = require('express');
const { validateJWTMiddleware } = require('../../utils/middlewares.js');

function generateXID(xidType) {
  return 'transient:' + xidType + '-' + crypto.randomUUID()
}

// IP, DOMAIN, HOST, IP_RANGE, MAC, USER 

const observableLoop = async (auth, observableArray, corelight_host ) => {
  let responsePayload = {
    indicators: {
      count: 0,
      docs: []
    },
    sightings: {
      count: 0,
      docs: []
    },
    relationships: {
      count: 0,
      docs: []
    }
  }

  let variables = queryFunctions.alerts_variables;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": auth
  };

  for (const observable of observableArray) {
    if (observable.type === 'ip') {
      variables.alert_filter.alert_entity_list = [{ "entity_type": "IP", "entity_name": observable.value }];
    } else if (observable.type === 'domain') {
      variables.alert_filter.alert_entity_list = [{ "entity_type": "DOMAIN", "entity_name": observable.value }];
    }

    const result = await queryFunctions.runQuery(queryFunctions.alerts_query, variables, headers, "Alerts", corelight_host);
    console.log(result.data.alerts.alerts);

    for (const alert of result.data.alerts.alerts) {
      if (alert.source_entities.length == 0) continue;
      if (alert.destination_entities.length == 0) continue;

      //console.log(alert.source_entities);
      //console.log(alert.destination_entities);

      let indicatorId = null;

      if (responsePayload.indicators.docs.find(indicator => indicator.description === alert.alert_info.alert_name + ' (' + alert.alert_info.alert_type + ')')) {
        indicatorId = responsePayload.indicators.docs.find(indicator => indicator.description === alert.alert_info.alert_name + ' (' + alert.alert_info.alert_type + ')').id;
      }

      if (!indicatorId) {
        let indicator = {
          description: `There was an ${alert.alert_info.alert_type} alert for ${alert.alert_info.alert_name}`,
          valid_time: {
            start_time: new Date(alert.alert_timestamp.start * 1000).toISOString(),
            end_time: new Date(alert.alert_timestamp.end * 1000).toISOString()
          },
          producer: "Corelight Alerts",
          schema_version: "1.2.1",
          type: "indicator",
          source: "Corelight Alerts",
          short_description: `There was an ${alert.alert_info.alert_type} alert for ${alert.alert_info.alert_name}`,
          title: alert.alert_info.alert_name + ' (' + alert.alert_info.alert_type + ')',
          id: generateXID('indicator')
        };

        responsePayload['indicators']['docs'].push(indicator);
        indicatorId = indicator.id;
      }

      let sighting = {
        type: 'sighting',
        schema_version: "1.2.1",
        count: 1,
        source: "Corelight Alerts",
        description: alert.alert_info.alert_name + ' for ' + alert.alert_entity.entity_name.replaceAll('.', '[.]'),
        short_description: alert.alert_info.alert_name + ' for ' + alert.alert_entity.entity_name.replaceAll('.', '[.]'),
        title: alert.alert_info.alert_name + ' for ' + alert.alert_entity.entity_name.replaceAll('.', '[.]'),
        observed_time: { start_time: new Date(alert.alert_timestamp.start * 1000).toISOString(), end_time: new Date(alert.alert_timestamp.end * 1000).toISOString() },
        created: new Date(alert.alert_timestamp.observed * 1000).toISOString(),
        internal: true,
        external_ids: [alert.alert_id],
        severity: alert.score <= 2 ? "Info" : alert.score <= 4 ? "Low" : alert.score <= 6 ? "Medium" : alert.score <= 8 ? "High" : "Critical",
        tlp: "amber",
        confidence: alert.false_positive ? "Low" : "High",
        source: `Corelight Alerts`,
        targets: [],
        observables: [],
        id: generateXID('sighting')
      }

      for (const destination of alert.destination_entities) {
        sighting.observables.push({
          type: destination.entity_type.toLowerCase(),
          value: destination.entity_name
        })
      }

      for (const source of alert.source_entities) {
        sighting.targets.push({
          type: "endpoint",
          observables: [
            {
              type: source.entity_type.toLowerCase(),
              value: source.entity_name
            }
          ],
          observed_time: { start_time: new Date(alert.alert_timestamp.start * 1000).toISOString() }
        })
      }

      responsePayload['sightings']['docs'].push(sighting);

      let relationship = {
        schema_version: "1.2.1",
        target_ref: sighting.id,
        type: "relationship",
        source_ref: indicatorId,
        id: generateXID('relationship'),
        relationship_type: "sighting-of"
      }

      responsePayload['relationships']['docs'].push(relationship);
    }
  }

  //  Check the doc counts
  responsePayload['sightings']['count'] = responsePayload['sightings']['docs'].length;
  responsePayload['indicators']['count'] = responsePayload['indicators']['docs'].length;
  responsePayload['relationships']['count'] = responsePayload['relationships']['docs'].length;

  console.log(responsePayload);

  return responsePayload;
}


module.exports = (app) => {
  app.post('/observe/observables', validateJWTMiddleware, async (req, res) => {
    // Authentication data is now available in req.authentication
    const observables = req.body;
    const returnData = await observableLoop(req.authentication.token, observables, req.authentication.corelight_host);
    res.send({ data: returnData });
  });

};
