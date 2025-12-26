import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route("/", "routes/_index.tsx"),
  route("all-products", "routes/all-products.tsx"),
  route("cart", "routes/cart.tsx"),
  route("my-orders", "routes/my-orders.tsx"),
  route("order-placed", "routes/order-placed.tsx"),
  route("product/:id", "routes/product.$id.tsx"),
  route("seller", "routes/seller.tsx", [
    index("routes/seller._index.tsx"),
    route("orders", "routes/seller.orders.tsx"),
    route("product-list", "routes/seller.product-list.tsx"),
  ]),
] satisfies RouteConfig;
