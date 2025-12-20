// Simple dev proxy server to forward /api requests to the ngrok backend
// Usage: npm install && npm run dev-proxy
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET = 'https://3aa822937d98.ngrok-free.app'; // ngrok target

app.use(cors());
app.use(express.json());

app.use('/api', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req) => {
    // Forward Authorization header if present from the browser
    if (req.headers && req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
    // Forward Accept-Language
    if (req.headers['accept-language']) {
      proxyReq.setHeader('Accept-Language', req.headers['accept-language']);
    }
    // Ensure host header is set to target
    proxyReq.setHeader('Host', new URL(TARGET).host);
  }
}));

app.listen(PORT, () => {
  console.log(`Dev proxy running on http://localhost:${PORT}, proxying /api -> ${TARGET}`);
});
