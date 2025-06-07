# Deployment & Environment Setup Guide

## Environment Variables

### Required Environment Variables

**Note:** The `.env.local` file contains all required keys and is already configured for NeonDB, but is hidden from the repository due to `.gitignore` for security purposes.

Create a `.env.local` file in your project root with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database_name"
NEON_DATABASE_URL="postgresql://username:password@hostname:port/database_name?sslmode=require"

# Authentication
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# External API Keys
OPENAI_API_KEY="sk-your-openai-api-key"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
ELEVENLABS_API_KEY="your-elevenlabs-api-key"

# Xero Integration
XERO_CLIENT_ID="your-xero-client-id"
XERO_CLIENT_SECRET="your-xero-client-secret"
XERO_REDIRECT_URI="https://your-domain.com/api/auth/xero/callback"

# File Storage
VERCEL_BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# App Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Video Generation APIs
RUNWAY_API_KEY="your-runway-ml-api-key"
WAN2_API_ENDPOINT="https://your-wan2-endpoint.com"
WAN2_API_KEY="your-wan2-api-key"

# Social Media APIs
INSTAGRAM_API_KEY="your-instagram-api-key"
FACEBOOK_API_KEY="your-facebook-api-key"
LINKEDIN_API_KEY="your-linkedin-api-key"

# Email Configuration
RESEND_API_KEY="your-resend-api-key"
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASSWORD="your-resend-api-key"

# Monitoring & Analytics
SENTRY_DSN="your-sentry-dsn"
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"
```

### Optional Environment Variables

```bash
# Development
NODE_ENV="development" # or "production"
LOG_LEVEL="debug" # debug, info, warn, error

# Rate Limiting
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# Feature Flags
ENABLE_EXPERIMENTAL_FEATURES="false"
ENABLE_AI_CONTENT_GENERATION="true"
ENABLE_VIDEO_GENERATION="true"
```

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- PostgreSQL (or NeonDB account)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/sylo-core.git
   cd sylo-core
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Optional: Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Database operations
npx prisma studio          # Open Prisma Studio
npx prisma db push         # Push schema changes
npx prisma db pull         # Pull schema from database
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Generate Prisma client
```

## Production Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure environment variables in Vercel dashboard**
   - Go to your project settings in Vercel
   - Add all environment variables from `.env.local`
   - Ensure `NODE_ENV` is set to `production`

3. **Set up custom domain (optional)**
   - Add your custom domain in Vercel project settings
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` accordingly

### Alternative Deployment Options

#### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t sylo-core .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local sylo-core
   ```

#### Manual Server Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "sylo-core" -- start
   pm2 save
   pm2 startup
   ```

### Kubernetes Deployment (Enterprise)

#### Kubernetes Configuration

1. **Create Kubernetes manifests**
   ```yaml
   # k8s/namespace.yaml
   apiVersion: v1
   kind: Namespace
   metadata:
     name: sylo-core
   
   ---
   # k8s/deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: sylo-core-app
     namespace: sylo-core
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: sylo-core
     template:
       metadata:
         labels:
           app: sylo-core
       spec:
         containers:
         - name: sylo-core
           image: sylo-core:latest
           ports:
           - containerPort: 3000
           env:
           - name: DATABASE_URL
             valueFrom:
               secretKeyRef:
                 name: sylo-secrets
                 key: database-url
           - name: OPENAI_API_KEY
             valueFrom:
               secretKeyRef:
                 name: sylo-secrets
                 key: openai-api-key
           resources:
             requests:
               memory: "512Mi"
               cpu: "250m"
             limits:
               memory: "1Gi"
               cpu: "500m"
           livenessProbe:
             httpGet:
               path: /api/health
               port: 3000
             initialDelaySeconds: 30
             periodSeconds: 10
           readinessProbe:
             httpGet:
               path: /api/ready
               port: 3000
             initialDelaySeconds: 5
             periodSeconds: 5
   
   ---
   # k8s/service.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: sylo-core-service
     namespace: sylo-core
   spec:
     selector:
       app: sylo-core
     ports:
     - protocol: TCP
       port: 80
       targetPort: 3000
     type: ClusterIP
   
   ---
   # k8s/ingress.yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: sylo-core-ingress
     namespace: sylo-core
     annotations:
       kubernetes.io/ingress.class: nginx
       cert-manager.io/cluster-issuer: letsencrypt-prod
       nginx.ingress.kubernetes.io/rate-limit: "100"
   spec:
     tls:
     - hosts:
       - sylo.yourdomain.com
       secretName: sylo-tls
     rules:
     - host: sylo.yourdomain.com
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: sylo-core-service
               port:
                 number: 80
   
   ---
   # k8s/secrets.yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: sylo-secrets
     namespace: sylo-core
   type: Opaque
   data:
     database-url: <base64-encoded-database-url>
     openai-api-key: <base64-encoded-openai-key>
     # Add other secrets as needed
   
   ---
   # k8s/configmap.yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: sylo-config
     namespace: sylo-core
   data:
     NODE_ENV: "production"
     LOG_LEVEL: "info"
     ENABLE_METRICS: "true"
   ```

2. **Deploy to Kubernetes**
   ```bash
   # Apply all configurations
   kubectl apply -f k8s/
   
   # Check deployment status
   kubectl get pods -n sylo-core
   kubectl get services -n sylo-core
   kubectl get ingress -n sylo-core
   
   # View logs
   kubectl logs -f deployment/sylo-core-app -n sylo-core
   
   # Scale deployment
   kubectl scale deployment sylo-core-app --replicas=5 -n sylo-core
   ```

#### Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sylo-core-hpa
  namespace: sylo-core
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sylo-core-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

#### Persistent Storage

```yaml
# k8s/storage.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sylo-redis-pvc
  namespace: sylo-core
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast-ssd

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: sylo-core
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
      volumes:
      - name: redis-storage
        persistentVolumeClaim:
          claimName: sylo-redis-pvc
```

#### Monitoring Stack

```yaml
# k8s/monitoring.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: sylo-core
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'sylo-core'
      static_configs:
      - targets: ['sylo-core-service:80']
      metrics_path: '/api/metrics'
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - sylo-core

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: sylo-core
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
        args:
          - '--config.file=/etc/prometheus/prometheus.yml'
          - '--storage.tsdb.path=/prometheus/'
          - '--web.console.libraries=/etc/prometheus/console_libraries'
          - '--web.console.templates=/etc/prometheus/consoles'
          - '--web.enable-lifecycle'
      volumes:
      - name: config
        configMap:
          name: prometheus-config

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: sylo-core
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          value: "admin123"
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
      volumes:
      - name: grafana-storage
        emptyDir: {}
```

## Performance Optimization

### Caching Strategy

1. **Static assets** → CDN caching (Vercel Edge)
2. **API responses** → Redis caching with TTL
3. **Database queries** → Prisma query caching
4. **User sessions** → JWT with refresh tokens

### Database Optimization

1. **Indexing strategy**
   ```sql
   CREATE INDEX idx_projects_firm_id ON projects(firm_id);
   CREATE INDEX idx_tasks_project_id ON tasks(project_id);
   CREATE INDEX idx_products_category_id ON products(category_id);
   ```

2. **Connection pooling**
   ```bash
   DATABASE_URL="postgresql://user:pass@host:port/db?connection_limit=10&pool_timeout=30"
   ```

### Bundle Optimization

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```