# Finova AI - Financial Analytics Frontend

Modern React-based dashboard for MSME financial analytics powered by AWS cloud processing.

## 🚀 Features

- **Async Cloud Processing**: Upload financial files to S3, process with AWS Lambda, get instant insights
- **Real-time Polling**: Automatic result retrieval when analysis completes
- **Dynamic Visualizations**: Adaptive charts for any company financial data
- **Generic Data Handling**: Works with expenses, revenue, budgets, and any financial datasets
- **Responsive Dashboard**: Clean, modern UI with dark theme

## 📋 Prerequisites

- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)

## 🛠️ Installation

```bash
cd frontend
npm install
```

## 🏃 Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

## 🏗️ Building for Production

```bash
npm run build
```

Production files will be in the `dist/` folder.

## 📦 Project Structure

```
frontend/
├── src/
│   ├── api.js                 # API client (presigned URLs, S3 upload, polling)
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   ├── styles.css             # Global styles
│   └── components/
│       ├── Dashboard.jsx      # Analytics dashboard with charts
│       └── UploadPanel.jsx    # File upload UI with progress
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔧 Configuration

### API Endpoints

Edit `frontend/src/api.js` to configure backend endpoints:

```javascript
const GETRESULT_URL = "https://YOUR-API-GATEWAY-URL/getresult/getResult";
const API_PREFIX = "https://YOUR-API-GATEWAY-URL/fileupload";
```

## 🌐 Backend Architecture

The backend is hosted on AWS:

- **S3**: File storage with presigned PUT URLs
- **Lambda**: Serverless processing triggered by S3 events
- **API Gateway**: REST API for presigned URL generation and result polling
- **IAM**: Secure role-based access control

## �️ Backend Overview

The backend for Finova AI is fully serverless and cloud-native, built to support scalable and secure financial data analytics:

- **AWS S3**: Stores all uploaded user files and processed analytics results using efficient, object-based cloud storage.

- **AWS Lambda (Python)**: Serverless functions automatically triggered by S3 events to perform data validation, cleaning, financial analytics, and anomaly detection (using libraries like pandas and boto3).

- **AWS API Gateway**: Exposes secure REST endpoints for the frontend app to request presigned upload URLs, trigger analysis, and poll for result status.

- **IAM Roles & Policies**: Ensures strict access control for Lambda, S3, and API Gateway interaction.

- **Extensibility**: The pipeline is compatible with additional AWS analytics/ML services (Amazon Bedrock, SageMaker, etc.) for future features.

- **Monitoring**: AWS CloudWatch is used for logging, metrics, and health checks across all backend components.

### Backend Architecture Flow

1. **Presigned URL Generation**: API Gateway endpoint issues S3 presigned URL for clients to upload files directly (no server relay needed).

2. **File Upload & Processing**: Upload to S3 triggers a Lambda function, which validates, parses, and analyzes the data, flagging anomalies and producing summaries.

3. **Result Polling**: Frontend polls API Gateway endpoint; Lambda checks S3 for result completion and returns structured analytics and AI-driven suggestions.

Tech stack: Python (lambda code), pandas (data analysis), boto3 (AWS operations), AWS S3, AWS Lambda, AWS API Gateway, IAM.

## �📊 Supported File Types

- CSV (`.csv`)
- Excel (`.xlsx`, `.xls`)
- PDF (`.pdf`)
- Images (`.png`, `.jpg`, `.jpeg`)

## 🎨 Features in Detail

### Upload Flow

1. Select financial file
2. Request presigned S3 URL from API
3. Direct upload to S3 (no server bandwidth)
4. Automatic polling for analysis results
5. Real-time dashboard display

### Dashboard Components

- **Summary Cards**: Key financial metrics (auto-detected)
- **Trend Charts**: Time-based analysis (monthly/weekly)
- **Category Breakdown**: Expense/revenue categories
- **Insights**: AI-generated recommendations
- **Anomalies**: Unusual transactions flagged
- **Duplicates**: Duplicate transaction detection

## 🚀 Deployment

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel

```bash
npm run build
# Deploy dist/ folder to Vercel
```

### AWS S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 🔐 Environment Variables

For production deployments, use environment variables:

```env
VITE_API_GATEWAY_URL=https://your-api-gateway-url
VITE_GETRESULT_URL=https://your-getresult-url
```

Update `api.js` to use:

```javascript
const API_PREFIX = import.meta.env.VITE_API_GATEWAY_URL;
const GETRESULT_URL = import.meta.env.VITE_GETRESULT_URL;
```

## 🤝 Contributing

This is a production frontend for an AWS-hosted financial analytics system.
