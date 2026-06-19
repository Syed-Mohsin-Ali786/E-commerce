import { assets } from "@/assets/assets";
import { useAppContext } from "../context/AppContext";
import { useLoaderData } from "react-router";
import { requireSeller } from "../.server/auth.server";
import { getOrdersForSeller } from "../.server/order.server";
import type { Route } from "./+types/seller.orders";

export async function loader(args: Route.LoaderArgs) {
  const seller = await requireSeller(args);
  const orders = await getOrdersForSeller(seller.id);
  return { orders };
}

const Orders = () => {
  const { currency } = useAppContext();
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      <div className="md:p-10 p-4 space-y-5">
        <h2 className="text-lg font-medium">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders for your products yet.</p>
        ) : (
          <div className="max-w-4xl rounded-md">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
              >
                <div className="flex-1 flex gap-5 max-w-80">
                  <img
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium">
                      {order.items
                        .map(
                          (item) =>
                            `${item.product.name} x ${item.quantity}`,
                        )
                        .join(", ")}
                    </span>
                    <span>Items : {order.items.length}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">
                      {order.address.fullName}
                    </span>
                    <br />
                    <span>{order.address.area}</span>
                    <br />
                    <span>
                      {`${order.address.city}, ${order.address.state}`}
                    </span>
                    <br />
                    <span>{order.address.phoneNumber}</span>
                  </p>
                </div>
                <p className="font-medium my-auto">
                  {currency}
                  {order.amount}
                </p>
                <div>
                  <p className="flex flex-col">
                    <span>Method : {order.paymentMethod}</span>
                    <span>
                      Date :{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>Status : {order.status.replace("_", " ")}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
