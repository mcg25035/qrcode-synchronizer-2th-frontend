// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 代理 API 請求到後端伺服器
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000/api/',
      changeOrigin: true,
      secure: false,
    })
  );

  // 代理 Socket.io 連接
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:5000/socket.io',
      changeOrigin: true,
      ws: true, // 啟用 WebSocket 支持
      secure: false,
      pathRewrite: {
        '^/socket.io': '/socket.io', // 保持路徑不變
      },
    })
  );
};
