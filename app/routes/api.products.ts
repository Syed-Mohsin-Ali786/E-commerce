import { getAllProducts } from "../.server/product.server";
import { toClientProducts } from "../.server/product-mapper";
import type { Route } from "./+types/api.products";

export async function loader(_args: Route.LoaderArgs) {
  const products = await getAllProducts();
  return { products: toClientProducts(products) };
}
