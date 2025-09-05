const axios = require('axios');

// The official endpoint for the Investigator API
// const GRAPHQL_ENDPOINT = "https://api.investigator.corelight.com/graphql";

// IMPORTANT: Replace "your-api-key" with your actual key below
const API_KEY = "";

const currentTime = Date.now() / 1000; // Convert to seconds
const fiveMinAgo = currentTime - 300;  // Subtract 5 minutes
const oneHourAgo = currentTime - 3600; // Subtract 1 hour
const twoHourAgo = currentTime - 7200; // Subtract 2 hours

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};


const alerts_query = `
query Alerts($alert_filter: AlertFilterInput, $offset: Int, $size: Int, $sort: [SortParameterInput]) {
  alerts(alert_filter: $alert_filter, offset: $offset, size: $size, sort: $sort) {
    alerts {
      alert_id
      alert_info { alert_name alert_type content_id }
      alert_entity { entity_id entity_name entity_type entity_category }
      alert_timestamp { start end observed ttl }
      score
      false_positive
      source_entities {
        entity_id
        entity_name
        entity_type
        entity_category
      }
      destination_entities {
        entity_id
        entity_name
        entity_type
        entity_category
      }
    }
    page_info {
      offset
      size
      total_items
      sort { sort_by sort_dir }
    }
  }
}
`;
const alerts_variables = {
    "alert_filter": {
        "score": {"gte": 1},
        "alert_entity_list": []
    },
    "offset": 0,
    "size": 100,
    "sort": [{"sort_by": "score", "sort_dir": "desc"}]
}
const alerts_variables2 = {
    "alert_filter": {
        "score": {"gte": 1},
        //"alert_info_list": [{"alert_name": "Suspicious Login"}]
        "alert_entity_list": [{"entity_type": "DOMAIN"}]
    },
    "offset": 0,
    "size": 100,
    "sort": [{"sort_by": "score", "sort_dir": "desc"}]
}

/**
 * Sends a GraphQL query and returns the response
 * @param {string} query - The GraphQL query string
 * @param {object} variables - Variables for the GraphQL query
 * @param {string} queryName - Name of the query for logging
 * @returns {Promise<object>} - The query response
 */
async function runQuery(query, variables = null, headers, queryName = "", GRAPHQL_ENDPOINT) {
    console.log(`--- Running Query: ${queryName} ---`);
    
    const payload = { query };
    if (variables) {
        payload.variables = variables;
    }

    try {
        const response = await axios.post(`${GRAPHQL_ENDPOINT}/graphql`, payload, {
            headers: headers,
            timeout: 30000
        });
        
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error(`HTTP error occurred: ${error.response.status} ${error.response.statusText}`);
            console.error(`Response Text: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.error(`An error occurred: ${error.message}`);
        }
        throw error;
    } finally {
        console.log("-".repeat(queryName.length + 20) + "\n");
    }
}

/**
 * Polls detections and prints the results
 */
async function pollDetections(graphqlEndpoint = "https://api.investigator.corelight.com/graphql") {
    try {
        const detectionNames = [];
        const result = await runQuery(alerts_query, alerts_variables2, headers, "Alerts", graphqlEndpoint);
        console.log(result.data.alerts.alerts);
    } catch (error) {
        console.error('Error polling alerts:', error.message);
        throw error;
    }
}

module.exports = {
    runQuery,
    pollDetections,
    alerts_query,
    alerts_variables,
    API_KEY
};

// If this file is run directly, execute pollDetections
if (require.main === module) {
    pollDetections().catch(console.error);
}
