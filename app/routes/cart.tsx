import { assets } from "@/assets/assets";
import OrderSummary from "./components/OrderSummary";
import EmptyState from "./components/EmptyState";
import { useAppContext } from "../context/AppContext";
import { Link, useLoaderData } from "react-router";
import { getAddressesByUser } from "../.server/address.server";
import { getOptionalUser, requireUserId } from "../.server/auth.server";
import { createOrder } from "../.server/order.server";
import { getProductById } from "../.server/product.server";
import {
  getCartItems,
  saveCartItems,
  type CartItems,
} from "../.server/user.server";
import { redirect } from "react-router";
import type { Route } from "./+types/cart";

export async function loader(args: Route.LoaderArgs) {
  const user = await getOptionalUser(args);
  if (!user) {
    return { addresses: [] as Awaited<ReturnType<typeof getAddressesByUser>> };
  }
  const addresses = await getAddressesByUser(user.id);
  return { addresses };
}

export async function action(args: Route.ActionArgs) {
  const userId = await requireUserId(args);
  const formData = await args.request.formData();
  const intent = formData.get("intent");

  if (intent === "sync-cart") {
    const raw = formData.get("cartItems");
    if (typeof raw !== "string") {
      return { error: "Invalid cart payload" };
    }
    const cartItems = JSON.parse(raw) as CartItems;
    await saveCartItems(userId, cartItems);
    return { ok: true };
  }

  if (intent === "place-order") {
    const addressId = String(formData.get("addressId") ?? "");
    if (!addressId) {
      return { error: "Please select a delivery address." };
    }

    const cartItems = await getCartItems(userId);
    const itemIds = Object.keys(cartItems).filter((id) => cartItems[id] > 0);

    if (itemIds.length === 0) {
      return { error: "Your cart is empty." };
    }

    const orderItems: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];
    let amount = 0;

    for (const productId of itemIds) {
      const product = await getProductById(productId);
      if (!product) continue;
      const quantity = cartItems[productId];
      amount += product.offerPrice * quantity;
      orderItems.push({
        productId: product.id,
        quantity,
        price: product.offerPrice,
      });
    }

    if (orderItems.length === 0) {
      return { error: "No valid products in cart." };
    }

    const tax = Math.floor(amount * 0.02 * 100) / 100;
    await createOrder({
      userId,
      addressId,
      items: orderItems,
      amount: amount + tax,
      paymentMethod: "COD",
    });

    await saveCartItems(userId, {});
    return redirect("/order-placed");
  }

  return { error: "Unknown action" };
}

const Cart = () => {
  const { products, cartItems, addToCart, updateCartQuantity, getCartCount } =
    useAppContext();
  const { addresses } = useLoaderData<typeof loader>();
  const isEmpty = getCartCount() === 0;

  return (
    <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
          <p className="text-2xl md:text-3xl text-gray-500">
            Your <span className="font-medium text-orange-600">Cart</span>
          </p>
          <p className="text-lg md:text-xl text-gray-500/80">
            {getCartCount()} Items
          </p>
        </div>
        {isEmpty ? (
          <EmptyState
            title="Your cart is empty"
            description="Add items from the shop to get started."
          />
        ) : (
          <>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="text-left">
              <tr>
                <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                  Product Details
                </th>
                <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                  Price
                </th>
                <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                  Quantity
                </th>
                <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(cartItems).map((itemId) => {
                const product = products.find(
                  (product) => product._id === itemId,
                );

                if (!product || cartItems[itemId] <= 0) return null;

                return (
                  <tr key={itemId}>
                    <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                      <div>
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-16 h-auto object-cover mix-blend-multiply"
                          />
                        </div>
                        <button
                          className="md:hidden text-xs text-orange-600 mt-1"
                          onClick={() => updateCartQuantity(product._id, 0)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-sm hidden md:block">
                        <p className="text-gray-800">{product.name}</p>
                        <button
                          className="text-xs text-orange-600 mt-1"
                          onClick={() => updateCartQuantity(product._id, 0)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                    <td className="py-4 md:px-4 px-1 text-gray-600">
                      ${product.offerPrice}
                    </td>
                    <td className="py-4 md:px-4 px-1">
                      <div className="flex items-center md:gap-2 gap-1">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              product._id,
                              cartItems[itemId] - 1,
                            )
                          }
                        >
                          <img
                            src={assets.decrease_arrow}
                            alt="decrease_arrow"
                            className="w-4 h-4"
                          />
                        </button>
                        <input
                          onChange={(e) =>
                            updateCartQuantity(
                              product._id,
                              Number(e.target.value),
                            )
                          }
                          type="number"
                          value={cartItems[itemId]}
                          className="w-8 border text-center appearance-none"
                        />
                        <button onClick={() => addToCart(product._id)}>
                          <img
                            src={assets.increase_arrow}
                            alt="increase_arrow"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 md:px-4 px-1 text-gray-600">
                      ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Link
          to="/all-products"
          className="group flex items-center mt-6 gap-2 text-orange-600"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow_right_icon_colored"
          />
          Continue Shopping
        </Link>
          </>
        )}
      </div>
      {!isEmpty && <OrderSummary addresses={addresses} />}
    </div>
  );
};

export default Cart;
