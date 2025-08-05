# Deployment-Handbuch

Dieses Handbuch behandelt Deployment-Strategien und -Konfigurationen für die Game Hub-Anwendung.

## Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Build-Prozess](#build-prozess)
- [Deployment-Plattformen](#deployment-plattformen)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Docker Deployment](#docker-deployment)
- [Umgebungskonfiguration](#umgebungskonfiguration)
- [Performance-Optimierung](#performance-optimierung)
- [Monitoring & Analytics](#monitoring--analytics)
- [CI/CD Pipeline](#cicd-pipeline)
- [Fehlerbehebung](#fehlerbehebung)

## Übersicht

Game Hub ist eine statische Single-Page-Anwendung (SPA), die mit Vite erstellt wurde und sich für das Deployment auf verschiedenen statischen Hosting-Plattformen eignet. Die Anwendung benötigt keine serverseitige Verarbeitung und kann als statische Dateien bereitgestellt werden.

### Deployment-Anforderungen

- **Node.js 18+** für das Building
- **Statisches Datei-Hosting** Fähigkeit
- **HTTPS-Unterstützung** für API-Aufrufe
- **Umgebungsvariablen** Unterstützung
- **Custom Domain** Unterstützung (optional)

### Aktuelles Deployment

**Produktions-URL**: [https://game-hub-beta-five.vercel.app/](https://game-hub-beta-five.vercel.app/)

## Build-Prozess

### Produktions-Build

```bash
# Abhängigkeiten installieren
npm install

# Für Produktion bauen
npm run build

# Build lokal vorschauen (optional)
npm run preview
```

### Build Output

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Application JavaScript bundle
│   ├── index-[hash].css    # Compiled CSS
│   └── *.webp              # Optimized images
└── vite.svg                # Favicon
```

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'dist',
    sourcemap: false,           // Disable sourcemaps in production
    minify: 'terser',          // Use terser for better compression
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@chakra-ui/react'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
```

## Deployment Platforms

### Comparison Matrix

| Platform | Free Tier | Build Time | Custom Domain | Analytics | CDN |
|----------|-----------|------------|---------------|-----------|-----|
| Vercel | ✅ | ~2-3 min | ✅ | ✅ | ✅ |
| Netlify | ✅ | ~2-4 min | ✅ | ✅ | ✅ |
| GitHub Pages | ✅ | ~3-5 min | ✅ | ❌ | ✅ |
| Firebase Hosting | ✅ | ~2-3 min | ✅ | ✅ | ✅ |

## Vercel Deployment

### Automatic Deployment

1. **Connect Repository**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration

2. **Configuration**
   ```json
   // vercel.json (optional)
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "installCommand": "npm install"
   }
   ```

3. **Environment Variables**
   ```bash
   # In Vercel dashboard
   VITE_RAWG_API_KEY=your_api_key_here
   ```

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Custom Domain Setup

1. **Add Domain** in Vercel dashboard
2. **Configure DNS** records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

### Vercel Configuration

```typescript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Netlify Deployment

### Automatic Deployment

1. **Connect Repository**
   - Visit [netlify.com](https://netlify.com)
   - Connect GitHub repository
   - Configure build settings

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Environment Variables

```bash
# In Netlify dashboard or CLI
netlify env:set VITE_RAWG_API_KEY your_api_key_here
```

## GitHub Pages Deployment

### Automatic Deployment with Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_RAWG_API_KEY: ${{ secrets.VITE_RAWG_API_KEY }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Manual Deployment

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add deploy script to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Build and deploy
npm run build
npm run deploy
```

### Base Path Configuration

```typescript
// vite.config.ts for GitHub Pages
export default defineConfig({
  base: '/game-hub/', // Repository name
  plugins: [react(), tsconfigPaths()],
})
```

## Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    server {
        listen       80;
        server_name  localhost;
        
        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location /assets/ {
            root /usr/share/nginx/html;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

### Docker Commands

```bash
# Build image
docker build -t game-hub .

# Run container
docker run -p 3000:80 game-hub

# Docker Compose
# docker-compose.yml
version: '3.8'
services:
  game-hub:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
```

## Environment Configuration

### Environment Variables

```bash
# .env.production
VITE_RAWG_API_KEY=production_api_key
VITE_API_BASE_URL=https://api.rawg.io/api
VITE_ENVIRONMENT=production
VITE_ANALYTICS_ID=your_analytics_id
```

### Environment-Specific Builds

```typescript
// src/config/environment.ts
interface Config {
  apiKey: string;
  apiBaseUrl: string;
  environment: string;
  enableAnalytics: boolean;
}

const getConfig = (): Config => {
  return {
    apiKey: import.meta.env.VITE_RAWG_API_KEY || '',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.rawg.io/api',
    environment: import.meta.env.VITE_ENVIRONMENT || 'development',
    enableAnalytics: import.meta.env.VITE_ENVIRONMENT === 'production',
  };
};

export default getConfig();
```

### Build-time Configuration

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    build: {
      sourcemap: mode === 'development',
    },
  };
});
```

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts - Production optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@chakra-ui/react', '@emotion/react'],
          utils: ['axios', 'zustand'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### Asset Optimization

```bash
# Optimize images before deployment
npm install --save-dev @squoosh/lib

# Image optimization script
node scripts/optimize-images.js
```

### CDN Configuration

```typescript
// For CDN deployment
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
```

### Cache Configuration

```javascript
// Service Worker for caching (optional)
// public/sw.js
const CACHE_NAME = 'game-hub-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## Monitoring & Analytics

### Performance Monitoring

```typescript
// src/utils/analytics.ts
interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
}

const trackPerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics: PerformanceMetrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstContentfulPaint: 0, // Requires additional setup
      };
      
      // Send to analytics service
      console.log('Performance metrics:', metrics);
    });
  }
};

export default trackPerformance;
```

### Error Tracking

```typescript
// src/utils/errorTracking.ts
const trackError = (error: Error, errorInfo?: any) => {
  if (import.meta.env.PROD) {
    // Send to error tracking service (e.g., Sentry)
    console.error('Application error:', error, errorInfo);
  }
};

// React Error Boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    trackError(error, errorInfo);
  }

  render() {
    // Error UI
  }
}
```

### Analytics Integration

```typescript
// Google Analytics 4 setup
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

const initAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.gtag = function() {
      // @ts-ignore
      dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
  }
};
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run tests
      run: npm run test -- --coverage
      
    - name: Build
      run: npm run build
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_RAWG_API_KEY: ${{ secrets.VITE_RAWG_API_KEY }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### Deployment Status Checks

```yaml
# Status check workflow
- name: Deployment Status
  run: |
    curl -f https://game-hub-beta-five.vercel.app/ || exit 1
    echo "✅ Deployment successful"
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules dist .vite
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   ```bash
   # Check environment variables
   echo $VITE_RAWG_API_KEY
   
   # Verify in build
   npm run build -- --mode production
   ```

3. **Routing Issues (404 on refresh)**
   - Ensure proper redirect configuration
   - Check server configuration for SPA routing

4. **Asset Loading Issues**
   ```typescript
   // Check base path configuration
   export default defineConfig({
     base: '/', // Adjust based on deployment path
   });
   ```

### Debug Commands

```bash
# Local production preview
npm run build && npm run preview

# Check bundle size
npm run build -- --analyze

# Verify environment
node -e "console.log(process.env)"
```

### Performance Debugging

```bash
# Lighthouse CLI audit
npm install -g lighthouse
lighthouse https://your-deployed-app.com --output=html --output-path=./report.html

# Bundle analyzer
npm install --save-dev vite-bundle-analyzer
```

## Security Considerations

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.rawg.io;
">
```

### Environment Security

```bash
# Never commit these files
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

## Next Steps

- Review [Frontend Development Guide](FRONTEND.md)
- Explore [API Integration Guide](API.md)
- Check [Contributing Guidelines](CONTRIBUTING.md)