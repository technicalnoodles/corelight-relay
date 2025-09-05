# Corelight Integration API

A Node.js Express API server that integrates Corelight's Investigator platform with Cisco XDR security tools. This service provides endpoints for threat intelligence, observable analysis, and security monitoring dashboards.

## Overview

This integration service acts as a middleware layer that:
- Connects to Corelight's GraphQL API for security alerts and detections
- Provides threat intelligence enrichment for observables (IPs, domains)
- Supports Cisco XDR authentication and authorization

## Architecture

The application is built with:
- **Express.js** - Web framework with middleware-based authentication
- **Axios** - HTTP client for API requests
- **JWT** - Token-based authentication with JWKS validation
- **GraphQL** - Query language for Corelight API
- **Middleware Architecture** - Centralized JWT validation across all protected endpoints

## API Endpoints

**All endpoints require JWT Bearer token authentication**

### Health Check
- **POST** `/health` - Validates API connectivity and authentication
- **Authentication**: JWT Bearer token required
- **Response**: API health status and Corelight connectivity

### Observable Reference
- **POST** `/refer/observables` - Generates references for threat hunting in XDR using Corelight Investigator
- **Authentication**: JWT Bearer token required
- **Payload**: Array of observables (IP addresses, domains)
- **Response**: Reference links for Corelight Investigator

### Tiles (Dashboard Data)
- **POST** `/tiles` - Returns available dashboard tile configurations
- **Authentication**: Not required
- **POST** `/tiles/tile-data` - Provides dashboard data for Corelight
- **Authentication**: JWT Bearer token required
- **Response**: Time-series data for dashboard visualization

### Threat Intelligence
- **POST** `/observe/observables` - Enriches observables with threat intelligence from Corelight alerts
- **Authentication**: JWT Bearer token required
- **Payload**: Array of observables (IP addresses, domains)
- **Response**: STIX-formatted indicators, sightings, and relationships

## Core Functions

### Authentication (`utils/auth.js`)
- **`validateJWT(token)`** - Validates JWT tokens with full JWKS verification
  - Signature verification using RS256 algorithm
  - Issuer validation ("IROH Int")
  - Expiration checking
  - Returns validation result with corelight_host and token
- **`getAuthHeaders(headers)`** - Processes JWT Bearer tokens and Basic auth credentials (decode-only)
- **`getKey(header, callback)`** - Retrieves JWKS signing keys for token validation

### Middleware (`utils/middlewares.js`)
- **`validateJWTMiddleware`** - Express middleware for JWT validation
  - Applied to all protected routes
  - Attaches authentication data to `req.authentication`
  - Returns 401 for invalid/missing tokens

### Query Management (`utils/query.js`)
- **`runQuery(query, variables, headers, queryName, graphqlEndpoint)`** - Executes GraphQL queries against dynamic Corelight API endpoints
  - Uses corelight_host from JWT token for multi-tenant support
  - Supports custom GraphQL endpoints per user
- **`pollDetections(graphqlEndpoint)`** - Polls for security alerts and detections
- Predefined GraphQL queries for alerts with filtering and sorting

### Time Utilities (`utils/time.js`)
- **`getNow()`** - Returns current epoch time in seconds
- **`getHourAgo(nowTime)`** - Calculates timestamp 1 hour ago
- **`getDayAgo(nowTime)`** - Calculates timestamp 1 day ago
- **`getMonthAgo(nowTime)`** - Calculates timestamp 1 month ago

### Tile Configuration (`utils/tileTypes.js`)
- Defines dashboard tile types and configurations for Corelight monitoring

### Corelight Queries (`utils/corelightQueries.js`)
- **`getDetections(auth, detection)`** - Retrieves detection data from Corelight API

## Route Handlers

### Health Route (`routes/health/healthRoute.js`)
Validates API connectivity by making a test query to Corelight's alerts endpoint.

### Refer Route (`routes/refer/referRoute.js`)
- **`observableLoop(observableArray)`** - Processes arrays of observables (IPs, domains)
- Generates pivot links to Corelight Investigator for threat hunting

### Tile Route (`routes/tiles/tileRoute.js`)
- Provides dashboard tile configurations
- Fetches Corelight agent status data with time-based filtering
- Supports multiple time periods (hour, day, week, month)

### Deliberate Route (`routes/deliberate/deliberateRoute.js`)
- **`generateXID(xidType)`** - Creates unique transaction IDs
- **`observableLoop(auth, observableArray)`** - Enriches observables with threat intelligence
- Processes Corelight alerts to generate:
  - **Indicators** - Threat intelligence indicators
  - **Sightings** - Observable detections with severity scoring
  - **Relationships** - Links between indicators and sightings

## Standalone Scripts

### Python Query Script (`query.py`)
- **`run_query(query, variables, query_name)`** - Executes GraphQL queries
- **`poll_detections()`** - Retrieves and displays recent detections
- Standalone script for testing Corelight API connectivity

## Configuration

### Environment Variables
- **NODE_ENV**: Set to `production` for production deployment (port 443)
- **Development port**: `6000`
- **Production port**: `443`
- **JWKS endpoint**: `https://visibility.amp.cisco.com/.well-known/jwks`
- **JWT Issuer**: `IROH Int`
- **Corelight API endpoints**: Dynamic per user (from JWT token)

### Dependencies
- `express` - Web framework
- `axios` - HTTP client
- `jsonwebtoken` - JWT handling
- `jwks-rsa` - JWKS client for token validation

## Usage

1. **Start the server:**
   ```bash
   node index.js
   ```

2. **Health check:**
   ```bash
   curl -X POST http://localhost:6000/health \
     -H "Authorization: Bearer <your-jwt-token>"
   ```

3. **Query observables:**
   ```bash
   curl -X POST http://localhost:6000/observe/observables \
     -H "Authorization: Bearer <your-jwt-token>" \
     -H "Content-Type: application/json" \
     -d '[{"type": "ip", "value": "192.168.1.1"}]'
   ```

## Security Features

- **Full JWT Validation**: Signature verification, issuer validation, expiration checking
- **JWKS Integration**: Real-time public key retrieval for token verification
- **Middleware Architecture**: Centralized authentication across all protected endpoints
- **Multi-tenant Support**: Dynamic API endpoints based on user's JWT token
- **Bearer Token Authentication**: Secure API communication with Corelight
- **Input Validation**: Observable type and format validation
- **Severity Scoring**: Threat intelligence risk assessment
- **TLP Classification**: Traffic Light Protocol for data sharing

## Integration Points

- **Corelight Investigator** - Primary threat intelligence source
- **Cisco XDR** - Authentication and authorization
 
## Deployment

### Development
```bash
# Start development server (port 6000)
node index.js
```

### Production
```bash
# Start production server (port 443)
NODE_ENV=production node index.js
```

### Docker Deployment
```bash
# Build Docker image
docker build -t corelight-app .

# Run container (production mode)
docker run -p 443:443 corelight-app

# Run with custom port mapping
docker run -p 8443:443 corelight-app
```

**Docker Features:**
- Node.js 22 Alpine base image
- Production environment (NODE_ENV=production)
- Non-root user execution
- Optimized for security and performance
