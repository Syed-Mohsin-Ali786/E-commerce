import { assets } from "@/assets/assets";
import { useAppContext } from "../context/AppContext";
import Loading from "./components/Loading";
import { requireUserId } from "../.server/auth.server";
import { getOrdersByUser } from "../.server/order.server";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/my-orders";

export async function loader(args: Route.LoaderArgs) {
  const userId = await requireUserId(args);
  const orders = await getOrdersByUser(userId);
  return { orders };
}

const MyOrders = () => {
  const { currency } = useAppContext();
  const { orders } = useLoaderData<typeof loader>();

  if (!orders) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
      <div className="space-y-5">
        <h2 className="text-lg font-medium mt-6">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 py-8">You have no orders yet.</p>
        ) : (
          <div className="max-w-5xl border-t border-gray-300 text-sm">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
              >
                <div className="flex-1 flex gap-5 max-w-80">
                  <img
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium text-base">
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
                      Date : {new Date(order.createdAt).toLocaleDateString()}
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

export default MyOrders;
