# Finova MSME Frontend

This is a small Vite + React app that implements:

- Presigned S3 upload flow (`/uploadfile` API)
- Direct PUT to S3 with progress
- Polling `/getresult` to fetch analytics result JSON
- Dashboard rendering of returned analytics

Run locally

```powershell
cd frontend
npm install
npm run dev
```

Notes

- Update `src/api.js` API_PREFIX if backend is served from a different origin.
- The components assume the backend `/uploadfile` returns `{ presigned_url, bucket, key }` and `/getresult` returns `{ ready: boolean, result: {} }`.
- For large-scale production, use authentication (Cognito), rate limiting, and better job status tracking (DynamoDB).
