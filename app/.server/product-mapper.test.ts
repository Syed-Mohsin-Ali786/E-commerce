import { describe, expect, it } from "vitest";
import {
  toClientProduct,
  toClientProducts,
} from "./product-mapper";
import type { Product } from "../../generated/prisma/client";

const mockProduct: Product = {
  id: "prod_test_1",
  sellerId: "user_seller_1",
  name: "Test Headphones",
  description: "Great sound quality.",
  price: 199.99,
  offerPrice: 149.99,
  images: ["https://example.com/image.webp"],
  category: "Headphone",
  createdAt: new Date("2025-01-15T10:00:00Z"),
  updatedAt: new Date("2025-01-15T10:00:00Z"),
};

describe("product-mapper", () => {
  it("maps a prisma product to the client shape", () => {
    const result = toClientProduct(mockProduct);

    expect(result._id).toBe("prod_test_1");
    expect(result.userId).toBe("user_seller_1");
    expect(result.image).toEqual(["https://example.com/image.webp"]);
    expect(result.offerPrice).toBe(149.99);
    expect(result.date).toBe(mockProduct.createdAt.getTime());
  });

  it("maps an array of products", () => {
    const results = toClientProducts([mockProduct, mockProduct]);
    expect(results).toHaveLength(2);
    expect(results[0]._id).toBe("prod_test_1");
  });
});
