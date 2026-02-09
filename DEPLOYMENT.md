# EasyKos Deployment Guide

Complete guide for deploying EasyKos to production.

## Architecture

```
┌─────────────┐      HTTPS       ┌──────────────┐
│   Vercel    │ ◄─────────────► │   Backend    │
│  (Next.js)  │                  │   (Laravel)  │
└─────────────┘                  └──────────────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │   MongoDB    │
                                  │   (Atlas)    │
                                  └──────────────┘
```

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)
- Backend hosting (Heroku, DigitalOcean, etc.)

## Step 1: Setup MongoDB Atlas

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier)
   - Select region closest to your backend host
   - Create cluster

3. **Configure Access**
   - Database Access → Add New User
   - Create username and password (save these!)
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/easykos?retryWrites=true&w=majority`

## Step 2: Deploy Backend

### Option A: Heroku

1. **Install Heroku CLI**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Prepare Backend**
```bash
cd backend
echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile
```

3. **Deploy**
```bash
heroku login
heroku create easykos-api
git subtree push --prefix backend heroku main
```

4. **Configure Environment**
```bash
heroku config:set APP_NAME="EasyKos API"
heroku config:set APP_ENV=production
heroku config:set APP_DEBUG=false
heroku config:set APP_KEY=base64:your-key-here
heroku config:set APP_URL=https://easykos-api.herokuapp.com
heroku config:set DB_CONNECTION=mongodb
heroku config:set DB_DSN="mongodb+srv://..."
heroku config:set FRONTEND_URL=https://easykos.vercel.app
```

5. **Run Migrations** (if using SQL during transition)
```bash
heroku run php artisan migrate --force
```

## Step 3: Deploy Frontend (Vercel)

1. **Push to GitHub**
   - Ensure code is pushed to GitHub
   - Repository should be public or accessible to Vercel

2. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   NEXT_PUBLIC_APP_NAME=EasyKos
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to project settings
   - Domains tab
   - Add your custom domain
   - Follow DNS configuration instructions

## Step 4: Post-Deployment Configuration

1. **Update Backend CORS**
   
   Update `backend/config/cors.php`:
   ```php
   'allowed_origins' => [
       env('FRONTEND_URL', 'http://localhost:3000'),
   ],
   ```

   Update `backend/.env`:
   ```env
   FRONTEND_URL=https://your-vercel-app.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
   ```

2. **Test API Connection**
   ```bash
   curl https://your-backend-url.com/api
   ```

3. **Test Frontend**
   - Visit your Vercel URL
   - Try to login
   - Check browser console for errors

## Step 5: Monitoring & Maintenance

### Vercel Monitoring

- **Analytics:** Built-in analytics in Vercel dashboard
- **Error Tracking:** View build and runtime errors
- **Performance:** Speed insights automatically enabled

### Backend Monitoring

**Laravel Log Viewer**
```bash
php artisan log:view
```

**Or use cloud monitoring:**
- Sentry for error tracking
- New Relic for APM
- LogRocket for user sessions

### Database Monitoring

**MongoDB Atlas Dashboard:**
- Performance metrics
- Slow queries
- Connection statistics
- Storage usage

## Backup Strategy

### Database Backups (MongoDB Atlas)

- **Automatic:** Atlas provides automated backups
- **Manual:** Use mongodump
  ```bash
  mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
  ```

### Code Backups

- Keep code in GitHub (already backed up)
- Tag releases:
  ```bash
  git tag -a v1.0.0 -m "Release version 1.0.0"
  git push origin v1.0.0
  ```

## Scaling

### Frontend (Vercel)
- Automatic scaling with Vercel
- CDN distribution worldwide
- Serverless architecture

### Backend Scaling

**Horizontal Scaling:**
- Add more application instances
- Use load balancer (Nginx, AWS ALB)
- Session storage in Redis

**Vertical Scaling:**
- Upgrade server resources
- Optimize queries
- Add caching (Redis)

### Database Scaling

**MongoDB Atlas:**
- Click cluster → "Modify"
- Choose larger tier
- Or enable sharding for massive scale

## SSL/HTTPS

### Frontend (Vercel)
- Automatic SSL certificates
- Free, managed by Vercel

### Backend
- Use Certbot (Let's Encrypt) for VPS
- Or cloud provider's SSL (Heroku, DO automatically provide)

## Environment Checklist

### Pre-Production
- [ ] All API endpoints working locally
- [ ] Frontend connects to local backend
- [ ] Database seeded with test data
- [ ] Authentication flow working
- [ ] Error handling implemented

### Production
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Backend deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] SSL certificates active
- [ ] CORS configured correctly
- [ ] Test login and basic operations
- [ ] Monitor logs for errors
- [ ] Set up monitoring/alerting
- [ ] Document any custom configurations

## Troubleshooting

### Frontend can't connect to backend

**Check:**
1. Backend URL in `.env.local` is correct
2. Backend CORS is configured for frontend domain
3. Backend is accessible (try curl)
4. Check browser console for specific errors

### Authentication not working

**Check:**
1. Sanctum configuration in backend
2. Token being sent in Authorization header
3. SANCTUM_STATEFUL_DOMAINS configured
4. Cookies/localStorage working

### Database connection failed

**Check:**
1. MongoDB connection string is correct
2. IP address whitelisted in Atlas
3. Database credentials are correct
4. MongoDB extension installed (`php -m | grep mongodb`)

## Cost Estimate

**Free Tier (Good for starting):**
- Vercel: Free (Hobby plan)
- MongoDB Atlas: Free (512MB storage)
- Backend: ~$5-7/month (Heroku/DO basic)

**Total: ~$5-7/month**

**Production Tier:**
- Vercel Pro: $20/month
- MongoDB Atlas: $25-57/month (M10 cluster)
- Backend: $25-50/month (better resources)

**Total: ~$70-127/month**

## Support & Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Laravel Deployment:** [laravel.com/docs/deployment](https://laravel.com/docs/deployment)
- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## Quick Deploy Commands

```bash
# Backend to Heroku
cd backend && git subtree push --prefix backend heroku main

# Frontend to Vercel
cd frontend && vercel --prod

# Database backup
mongodump --uri="$MONGODB_URI" --out=./backup-$(date +%Y%m%d)
```

---

**Congratulations!** Your EasyKos application is now deployed and ready for production use! 🚀
