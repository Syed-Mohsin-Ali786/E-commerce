import { useAppContext } from "@/context/AppContext";
import { useFetcher, useNavigate } from "react-router";
import { useEffect, useState } from "react";

type AddressSummary = {
  id: string;
  fullName: string;
  area: string;
  city: string;
  state: string;
};

type OrderSummaryProps = {
  addresses: AddressSummary[];
};

const OrderSummary = ({ addresses }: OrderSummaryProps) => {
  const { currency, getCartCount, getCartAmount, cartItems, user } =
    useAppContext();
  const navigate = useNavigate();
  const fetcher = useFetcher<{ error?: string }>();
  const [selectedAddress, setSelectedAddress] = useState<AddressSummary | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const error = fetcher.data?.error;

  const handleAddressSelect = (address: AddressSummary) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = () => {
    if (!user) {
      navigate("/");
      return;
    }
    if (!selectedAddress) {
      return;
    }
    fetcher.submit(
      {
        intent: "place-order",
        addressId: selectedAddress.id,
      },
      { method: "post" },
    );
  };

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              type="button"
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {addresses.map((address) => (
                  <li
                    key={address.id}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => navigate("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
          {addresses.length === 0 && (
            <button
              type="button"
              onClick={() => navigate("/add-address")}
              className="text-sm text-orange-600 mt-2 hover:underline"
            >
              Add your first address
            </button>
          )}
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button
              type="button"
              className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700"
            >
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {currency}
              {Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {getCartAmount() + Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={createOrder}
        disabled={
          fetcher.state !== "idle" ||
          !selectedAddress ||
          Object.keys(cartItems).length === 0
        }
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:opacity-50"
      >
        {fetcher.state !== "idle" ? "Placing order…" : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;
