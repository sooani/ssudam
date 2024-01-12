const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/v1",
    createProxyMiddleware({
      // target: "http://15.164.28.18:8080",
      target: "http://localhost:8080",
      changeOrigin: true,
    })
  );
};
