import { assets } from "@/assets/assets";
import { Link, useLoaderData } from "react-router";
import { requireSeller } from "../.server/auth.server";
import { getProductsBySeller } from "../.server/product.server";
import { toClientProducts } from "../.server/product-mapper";
import type { Route } from "./+types/seller.product-list";

export async function loader(args: Route.LoaderArgs) {
  const seller = await requireSeller(args);
  const products = await getProductsBySeller(seller.id);
  return { products: toClientProducts(products) };
}

const ProductList = () => {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">
            No products yet.{" "}
            <Link to="/seller" className="text-orange-600 hover:underline">
              Add your first product
            </Link>
          </p>
        ) : (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-16"
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {product.category}
                    </td>
                    <td className="px-4 py-3">${product.offerPrice}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md w-fit"
                      >
                        <span className="hidden md:block">Visit</span>
                        <img
                          className="h-3.5"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
