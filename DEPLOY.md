# Deployment Guide - Finova AI Frontend

## Quick Deploy Options

### Option 1: Netlify (Recommended for React apps)

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**

   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify UI**
   - Connect your GitHub repo
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`

### Option 2: Vercel

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   cd frontend
   vercel --prod
   ```

3. **Or use Vercel UI**
   - Import GitHub repository
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`

### Option 3: AWS S3 + CloudFront

1. **Build**

   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**

   ```bash
   aws s3 mb s3://finova-frontend
   aws s3 website s3://finova-frontend --index-document index.html
   ```

3. **Upload**

   ```bash
   aws s3 sync dist/ s3://finova-frontend --delete --acl public-read
   ```

4. **Optional: CloudFront CDN**
   - Create CloudFront distribution pointing to S3 bucket
   - Update API endpoints if using custom domain

### Option 4: GitHub Pages

1. **Build**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy with gh-pages**
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## Environment Configuration

For production deployments, create `.env.production` in `frontend/`:

```env
VITE_API_GATEWAY_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com
VITE_GETRESULT_URL=https://your-getresult-api-url.execute-api.region.amazonaws.com
```

Then update `frontend/src/api.js`:

```javascript
const API_PREFIX =
  import.meta.env.VITE_API_GATEWAY_URL ||
  "https://k0f458l9i8.execute-api.us-east-2.amazonaws.com/fileupload";
const GETRESULT_URL =
  import.meta.env.VITE_GETRESULT_URL ||
  "https://w4vebx9487.execute-api.us-east-2.amazonaws.com/getresultnew/getresult/getResult";
```

## Post-Deployment Checklist

- [ ] Update API endpoint URLs in `api.js` or use environment variables
- [ ] Test file upload flow with real data
- [ ] Verify CORS settings on API Gateway allow your domain
- [ ] Check S3 bucket policies allow presigned URL uploads
- [ ] Test polling mechanism receives results
- [ ] Verify dashboard renders with actual data

## Custom Domain Setup

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records as instructed

### Vercel

1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS with Vercel nameservers

### AWS CloudFront

1. Request SSL certificate in ACM
2. Add CNAME to CloudFront distribution
3. Update Route53 or your DNS provider

## Monitoring

- **Netlify**: Built-in analytics and deploy logs
- **Vercel**: Real-time logs and analytics
- **AWS**: CloudWatch for S3/CloudFront metrics

## Rollback

All platforms support instant rollback to previous deployments through their dashboards.

## Support

For deployment issues, check:

- Build logs for errors
- CORS configuration on API Gateway
- S3 bucket permissions
- IAM role policies
