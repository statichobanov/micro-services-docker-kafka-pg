import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import authenticateToken from "./middleware/authenticateToken.js";

const app = express();
const PORT = 3003;

const authenticationServiceProxy = createProxyMiddleware({
  target: "http://authentication-service:3001",
  changeOrigin: true,
});

const productCatalogServiceProxy = createProxyMiddleware({
  target: "http://product-catalog-service:3002",
  changeOrigin: true,
});

const orderServiceProxy = createProxyMiddleware({
  target: "http://order-service:3004",
  changeOrigin: true,
});

/* Use the proxies based on the path */
app.use("/authentication", authenticateToken, authenticationServiceProxy);
app.use("/product-catalog", authenticateToken, productCatalogServiceProxy);
app.use("/order", authenticateToken, orderServiceProxy);

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
