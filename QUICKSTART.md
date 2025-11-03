# Quick Start Guide

## First Time Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/SRUJAN-cpu/Finova_AI.git
   cd Finova_AI
   ```

2. **Install dependencies**

   ```bash
   npm run install-deps
   # OR
   cd frontend && npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # OR
   cd frontend && npm run dev
   ```

4. **Open in browser**
   - Visit http://localhost:5173 (or the port shown in terminal)

## Project Structure

```
Finova_AI/
├── frontend/               # React application
│   ├── src/
│   │   ├── api.js         # API client (AWS integration)
│   │   ├── App.jsx        # Main component
│   │   ├── components/    # React components
│   │   └── styles.css     # Global styles
│   ├── package.json       # Frontend dependencies
│   └── index.html         # Entry HTML
├── .gitignore             # Git ignore rules
├── README.md              # Main documentation
├── DEPLOY.md              # Deployment guide
├── LICENSE                # License file
└── package.json           # Root package (convenience scripts)
```

## Available Commands

From root directory:

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run install-deps # Install frontend dependencies
```

From frontend directory:

```bash
npm run dev          # Start Vite dev server
npm run build        # Build optimized bundle
npm run preview      # Preview production build locally
```

## Configuration

### Update API Endpoints

Edit `frontend/src/api.js`:

```javascript
const GETRESULT_URL = "YOUR_GETRESULT_API_URL";
const API_PREFIX = "YOUR_UPLOAD_API_URL";
```

### Environment Variables (Optional)

Create `frontend/.env.production`:

```env
VITE_API_GATEWAY_URL=https://your-api.execute-api.region.amazonaws.com
VITE_GETRESULT_URL=https://your-getresult-api.execute-api.region.amazonaws.com
```

## Testing the App

1. **Upload a financial CSV file** with columns like:

   - Date, Amount, Category, Description, etc.

2. **Watch the upload progress**:

   - Presign → Upload → Processing → Results

3. **View analytics**:
   - Summary cards (totals, income, expenses)
   - Trend charts (monthly/weekly)
   - Category breakdown
   - Recommendations & anomalies

## Supported File Formats

- CSV (`.csv`)
- Excel (`.xlsx`, `.xls`)
- PDF (`.pdf`)
- Images (`.png`, `.jpg`, `.jpeg`)

## Troubleshooting

### Port already in use

If port 5173 is busy, Vite will automatically use the next available port (5174, 5175, etc.)

### CORS errors

- Ensure API Gateway has CORS enabled
- Check that your API allows the frontend origin

### Upload fails with 403

- Verify IAM role has `s3:PutObject` permission
- Check S3 bucket policy

### Polling never completes

- Check Lambda function execution
- Verify S3 event triggers are configured
- Review CloudWatch logs

## Backend Architecture

The frontend connects to:

1. **Upload API**: `/upload-url` endpoint
   - Returns presigned S3 URL
2. **S3 Bucket**: Direct file upload
   - Triggers Lambda on upload
3. **Result API**: `/getresult` endpoint
   - Polls for analysis completion

## Git Workflow

```bash
# Pull latest changes
git pull

# Create feature branch
git checkout -b feature/your-feature

# Make changes, then stage
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/your-feature
```

## Deployment

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

**Quick deploy with Netlify:**

```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

## Need Help?

- Check [README.md](README.md) for full documentation
- Review [DEPLOY.md](DEPLOY.md) for deployment options
- Open an issue on GitHub for bugs

---

**Happy coding! 🚀**
