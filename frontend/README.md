## Setup Instructions

### Local Development
1. **Frontend:**
   - `cd frontend`
   - `yarn install`
   - `yarn dev`
   - Open browser at provided localhost URL.

2. **Backend (Lambda):**
   - `cd ../backend`
   - Install backend dependencies: `yarn install`
   - Local test: `sam local start-api`
   - Test event: `src/lambdas/searchProviders/events/testEvent.json`

### AWS Deployment
1. **Backend:**
   - `cd ../backend`
   - Ensure AWS CLI and SAM CLI are configured.
   - `yarn build`
   - `sam deploy --guided`

2. **Frontend:**
   - `cd ../frontend`
   - `yarn build`
   - Deploy contents of `dist` or `build` to S3 (static website) or CloudFront.

## Local Environment

1. Node.js 14+ and AWS SAM CLI required.
2. Optional: Create `.env` in `frontend` to override default GraphQL endpoint:
   ```
   REACT_APP_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
   ```

### Local Backend
- From `frontend`:
  ```
  cd ../backend
  yarn install
  yarn local
  ```
  Test Lambda with `src/lambdas/searchProviders/events/testEvent.json`.

### Local Frontend
- From `frontend`:
  ```
  yarn dev
  ```
  Vite serves on a local port (e.g., http://localhost:5173).

### Connecting Frontend and Backend
- Default: Frontend calls backend at `http://localhost:4000/graphql` (SAM API).
- Adjust port in `.env` if needed.

### Local Testing
- To test the backend Lambda function locally:
  1. Ensure the AWS SAM CLI is installed and configured.
  2. Navigate to the `backend` directory.
  3. Run `sam local invoke SearchProvidersFunction -e src/lambdas/searchProviders/events/testEvent.json` to invoke the Lambda function with the test event.
